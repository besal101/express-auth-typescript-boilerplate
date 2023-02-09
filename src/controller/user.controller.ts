import { Request, Response } from 'express';
import { CreateUserInput, ForgotPasswordInput, ResetPasswordInput, VerifyUserInput } from '../schema/user.schema';
import { createUser, findUserByEmail, findUserById } from '../service/user.service';
import sendEmail from '../utils/mailer';
import log from '../utils/logger';
import { nanoid } from 'nanoid';

export async function createuserHandler(req: Request<{}, {}, CreateUserInput>, res: Response) {
    const body = req.body;
    try {
        const user = await createUser(body);
        console.log(user);

        await sendEmail({
            to: user.email,
            from: "test@example.com",
            subject: "Verify your email",
            text: `verification code: ${user.verificationCode}. Id: ${user._id}`,
        });

        return res.send("User successfully created");

    }
    catch (err: any) {
        if (err.code === 11000) {
            return res.status(409).send("User with that email already exists");
        }
        return res.status(500).send(err.message);
    }
}

export async function verifyUserHandler(req: Request<VerifyUserInput>, res: Response) {
    const id = req.params.id;
    const verificationCode = req.params.verificationCode;

    /**
     * Find user by id and verification code
     */
    const user = await findUserById(id);
    if (!user) {
        return res.send("Could not find user");
    }
    /**
    * Check to see if user is already verified
    */
    if (user.verified) {
        return res.send("User already verified");
    }
    /**
     * Check to see if the verification code is correct
    */

    if (user.verificationCode === verificationCode) {
        user.verified = true;
        await user.save();
        return res.send("User successfully verified");
    }

    return res.send("Verification code is incorrect");




}

export async function forgotPasswordHandler(req: Request<{}, {}, ForgotPasswordInput>, res: Response) {
    const message = "If a user with that email exists, we will send an email with a password reset code";
    const { email } = req.body;
    const user = await findUserByEmail(email);
    if (!user) {
        log.debug(`User with email ${email} not found`);
        return res.send(message);
    }
    if (!user.verified) {
        return res.send("User is not verified");
    }

    const passwordResetCode = nanoid();
    user.passwordResetCode = passwordResetCode;
    await user.save();

    await sendEmail({
        to: user.email,
        from: "test@example.com",
        subject: "Password reset code",
        text: `password reset code: ${passwordResetCode}. Id: ${user._id}`,
    });

    log.debug(`Password reset code sent to ${email}`);

    return res.send(message);
}

export async function resetPasswordhandler(req: Request<ResetPasswordInput['params'], {}, ResetPasswordInput['body']>, res: Response) {
    const { id, passwordResetCode } = req.params;
    const { password } = req.body;
    const user = await findUserById(id);

    if (!user || !user.passwordResetCode || user.passwordResetCode !== passwordResetCode) {
        return res.send("User not found");
    }

    user.passwordResetCode = null;

    user.password = password;

    await user.save();

    return res.send("Password successfully reset");
}

export async function getCurrentUserHandler(req: Request, res: Response) {
    return res.send(res.locals.user);
}