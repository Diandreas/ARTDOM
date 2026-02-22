<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reçu - {{ $reservation->reservation_number }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'DejaVu Sans', Arial, sans-serif;
            font-size: 12px;
            line-height: 1.6;
            color: #333;
            padding: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #4F46E5;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #4F46E5;
            margin-bottom: 5px;
        }
        .tagline {
            font-size: 10px;
            color: #666;
            font-style: italic;
        }
        .receipt-title {
            font-size: 18px;
            font-weight: bold;
            margin: 20px 0;
            text-align: center;
        }
        .info-section {
            margin-bottom: 20px;
        }
        .info-section h3 {
            font-size: 14px;
            color: #4F46E5;
            margin-bottom: 10px;
            border-bottom: 1px solid #E5E7EB;
            padding-bottom: 5px;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
        }
        .info-label {
            color: #666;
            font-weight: 600;
        }
        .info-value {
            text-align: right;
        }
        .payment-details {
            background-color: #F9FAFB;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .total-row {
            font-size: 16px;
            font-weight: bold;
            color: #4F46E5;
            margin-top: 10px;
            padding-top: 10px;
            border-top: 2px solid #4F46E5;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #E5E7EB;
            text-align: center;
            font-size: 10px;
            color: #666;
        }
        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: bold;
        }
        .status-confirmed {
            background-color: #D1FAE5;
            color: #065F46;
        }
        .status-pending {
            background-color: #FEF3C7;
            color: #92400E;
        }
        .status-cancelled {
            background-color: #FEE2E2;
            color: #991B1B;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">ARTDOM</div>
        <div class="tagline">Artistes d'émotions, messagers de cœurs</div>
    </div>

    <div class="receipt-title">REÇU DE RÉSERVATION</div>

    <div class="info-section">
        <h3>Informations de Réservation</h3>
        <div class="info-row">
            <span class="info-label">Numéro de réservation :</span>
            <span class="info-value"><strong>{{ $reservation->reservation_number }}</strong></span>
        </div>
        <div class="info-row">
            <span class="info-label">Date de réservation :</span>
            <span class="info-value">{{ $reservation->created_at->format('d/m/Y à H:i') }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Statut :</span>
            <span class="info-value">
                <span class="status-badge status-{{ $reservation->status }}">
                    {{ ucfirst($reservation->status) }}
                </span>
            </span>
        </div>
    </div>

    <div class="info-section">
        <h3>Détails de la Prestation</h3>
        <div class="info-row">
            <span class="info-label">Service :</span>
            <span class="info-value">{{ $reservation->service->title }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Artiste :</span>
            <span class="info-value">{{ $reservation->artist->artistProfile->stage_name ?? $reservation->artist->name }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Date de prestation :</span>
            <span class="info-value">{{ $reservation->scheduled_at->format('d/m/Y à H:i') }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Durée :</span>
            <span class="info-value">{{ $reservation->duration_minutes }} minutes</span>
        </div>
        @if($reservation->location_address)
        <div class="info-row">
            <span class="info-label">Lieu :</span>
            <span class="info-value">{{ $reservation->location_address }}</span>
        </div>
        @endif
    </div>

    @if($reservation->recipient_name || $reservation->custom_message)
    <div class="info-section">
        <h3>Personnalisation</h3>
        @if($reservation->recipient_name)
        <div class="info-row">
            <span class="info-label">Destinataire :</span>
            <span class="info-value">{{ $reservation->recipient_name }}</span>
        </div>
        @endif
        @if($reservation->emotion_type)
        <div class="info-row">
            <span class="info-label">Type d'émotion :</span>
            <span class="info-value">{{ ucfirst($reservation->emotion_type) }}</span>
        </div>
        @endif
        @if($reservation->custom_message)
        <div class="info-row">
            <span class="info-label">Message personnalisé :</span>
        </div>
        <div style="padding: 10px; background: #F9FAFB; border-radius: 4px; margin-top: 5px; font-style: italic;">
            "{{ $reservation->custom_message }}"
        </div>
        @endif
    </div>
    @endif

    <div class="payment-details">
        <h3 style="margin-bottom: 10px;">Détails du Paiement</h3>
        <div class="info-row">
            <span class="info-label">Montant de la prestation :</span>
            <span class="info-value">{{ number_format($reservation->total_amount - $reservation->commission_amount, 0, ',', ' ') }} FCFA</span>
        </div>
        <div class="info-row">
            <span class="info-label">Frais de plateforme ({{ $reservation->commission_rate }}%) :</span>
            <span class="info-value">{{ number_format($reservation->commission_amount, 0, ',', ' ') }} FCFA</span>
        </div>
        <div class="info-row total-row">
            <span>TOTAL PAYÉ :</span>
            <span>{{ number_format($reservation->total_amount, 0, ',', ' ') }} FCFA</span>
        </div>
        @if($reservation->payment)
        <div class="info-row" style="margin-top: 10px;">
            <span class="info-label">Moyen de paiement :</span>
            <span class="info-value">{{ ucfirst(str_replace('_', ' ', $reservation->payment->method)) }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Référence de transaction :</span>
            <span class="info-value">{{ $reservation->payment->provider_ref }}</span>
        </div>
        @if($reservation->payment->paid_at)
        <div class="info-row">
            <span class="info-label">Date de paiement :</span>
            <span class="info-value">{{ $reservation->payment->paid_at->format('d/m/Y à H:i') }}</span>
        </div>
        @endif
        @endif
    </div>

    <div class="info-section">
        <h3>Informations Client</h3>
        <div class="info-row">
            <span class="info-label">Nom :</span>
            <span class="info-value">{{ $reservation->client->name }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Email :</span>
            <span class="info-value">{{ $reservation->client->email }}</span>
        </div>
        @if($reservation->client->phone)
        <div class="info-row">
            <span class="info-label">Téléphone :</span>
            <span class="info-value">{{ $reservation->client->phone }}</span>
        </div>
        @endif
    </div>

    <div class="footer">
        <p><strong>ARTDOM</strong> - Plateforme de réservation d'artistes</p>
        <p style="margin-top: 5px;">Abidjan, Côte d'Ivoire | contact@artdom.ci | +225 XX XX XX XX XX</p>
        <p style="margin-top: 10px; font-size: 9px;">
            Ce document est un reçu officiel de votre réservation.<br>
            Pour toute question, veuillez nous contacter à support@artdom.ci
        </p>
    </div>
</body>
</html>
