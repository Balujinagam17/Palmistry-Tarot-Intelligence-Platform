from enum import Enum


class UserRole(str, Enum):
    USER = "USER"
    TAROT_READER = "TAROT_READER"
    SPIRITUAL_CONSULTANT = "SPIRITUAL_CONSULTANT"
    ADMIN = "ADMIN"