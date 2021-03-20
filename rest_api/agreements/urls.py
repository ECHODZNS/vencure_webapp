from django.urls import path
from .api import (
    CreateAgreement,
    ReadAgreements,
    AcceptAgreement,
    AcceptAgreementCounter,
    SetAgreementToCounter,
    UpdateAgreementCounterPrice,
    RejectAgreement,
    RejectAgreementCounter,
    ReadExpiringSoonAgreements
)


urlpatterns = [
    path('create/<str:id>', CreateAgreement.as_view()),
    path('read', ReadAgreements.as_view()),
    path('readExpiringSoon', ReadExpiringSoonAgreements.as_view()),
    path('accept/<str:id>', AcceptAgreement.as_view()),
    path('accept_counter/<str:id>', AcceptAgreementCounter.as_view()),

    path('set_agreement_counter/<str:id>', SetAgreementToCounter.as_view()),
    path('update_agreement_counter/<str:id>',
         UpdateAgreementCounterPrice.as_view()),

    path('reject_agreeement/<str:id>', RejectAgreement.as_view()),
    path('reject_agreeement_counter/<str:id>',
         RejectAgreementCounter.as_view()),
]
