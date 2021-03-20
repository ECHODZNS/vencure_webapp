def MODULE_STORE_SUCCESS(module):
    return module + " has been added successfully !"


def MODULE_NOT_FOUND(module):
    return "No " + module + " found."


def MODULE_LIST(module):
    return module + " list."


# All delete(destroy/status change) method messages
def MODULE_STATUS_CHANGE(module, status):
    return module + " has been " + status + " successfully!"


LOGIN_SUCCESS = "Login Successful! redirecting..."
CHANGE_PASSWORD_SUCCESS = "Your password has been changed successfully."
PASSWORD_MISMATCH = "Incorrect old password."
USER_EMAIL_EXISTS = "Email already exists."
RESET_PASSWORD_SUCCESS = "Password reset request has been processed successfully."
ACCOUNT_BLOCKED = "Your account has been blocked by manufacturer"
# Vendor
VENDOR_CREATED = "Vendor has been created successfully."


# RECAPTCHCA
CAPTCHA_NOT_VERIFIED = "Invalid captcha string. Please try again."
CAPTCHA_FAILED = "Captcha verification is failed."

NOT_VALID_PARAMS = "Request has not valid parameters"
INVALID_RECAPTCHA = "Invalid reCaptcha!"
NOT_ACCEPTABLE_REQUEST = "Request Not Acceptable"
OTP_SUBJECT = "Verify your email account."
