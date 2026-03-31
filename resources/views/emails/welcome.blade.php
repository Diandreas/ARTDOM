<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenue sur Artemo</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #0f0f13; color: #e8e4dc; }
        .wrapper { max-width: 600px; margin: 0 auto; background: #0f0f13; }

        /* Header */
        .header {
            background: linear-gradient(135deg, #1a1a24 0%, #0f0f13 100%);
            padding: 40px 40px 30px;
            text-align: center;
            border-bottom: 2px solid #c9a84c;
            position: relative;
            overflow: hidden;
        }
        .header::before {
            content: '';
            position: absolute;
            inset: 0;
            background: repeating-linear-gradient(
                45deg,
                transparent,
                transparent 8px,
                rgba(201,168,76,0.04) 8px,
                rgba(201,168,76,0.04) 10px
            );
        }
        .logo { width: 64px; height: 64px; margin: 0 auto 16px; position: relative; z-index: 1; }
        .logo img { width: 100%; height: 100%; object-fit: contain; }
        .logo-text {
            font-size: 28px;
            font-weight: 800;
            color: #c9a84c;
            letter-spacing: 2px;
            position: relative;
            z-index: 1;
        }
        .tagline {
            font-size: 13px;
            color: #8a7a6a;
            margin-top: 6px;
            letter-spacing: 1px;
            position: relative;
            z-index: 1;
        }

        /* Body */
        .body { padding: 40px; }

        .greeting {
            font-size: 22px;
            font-weight: 700;
            color: #f0ebe0;
            margin-bottom: 16px;
        }
        .greeting span { color: #c9a84c; }

        .intro {
            font-size: 15px;
            color: #a09080;
            line-height: 1.7;
            margin-bottom: 32px;
        }

        /* Feature cards */
        .features {
            display: table;
            width: 100%;
            margin-bottom: 32px;
        }
        .feature-row { display: table-row; }
        .feature {
            display: table-cell;
            width: 50%;
            padding: 0 8px 16px 0;
            vertical-align: top;
        }
        .feature:last-child { padding-right: 0; padding-left: 8px; }
        .feature-box {
            background: #1a1a24;
            border: 1px solid #2a2a3a;
            border-radius: 12px;
            padding: 20px;
        }
        .feature-icon {
            font-size: 24px;
            margin-bottom: 10px;
        }
        .feature-title {
            font-size: 14px;
            font-weight: 700;
            color: #c9a84c;
            margin-bottom: 6px;
        }
        .feature-desc {
            font-size: 12px;
            color: #6a6070;
            line-height: 1.5;
        }

        /* CTA */
        .cta-section { text-align: center; margin-bottom: 36px; }
        .cta-btn {
            display: inline-block;
            background: linear-gradient(135deg, #c9a84c, #b8903c);
            color: #0f0f13 !important;
            font-weight: 800;
            font-size: 15px;
            padding: 14px 40px;
            border-radius: 50px;
            text-decoration: none;
            letter-spacing: 0.5px;
            box-shadow: 0 4px 20px rgba(201,168,76,0.3);
        }

        /* Stats banner */
        .stats {
            background: #1a1a24;
            border-radius: 12px;
            border: 1px solid #2a2a3a;
            padding: 20px;
            display: table;
            width: 100%;
            margin-bottom: 32px;
        }
        .stat { display: table-cell; text-align: center; border-right: 1px solid #2a2a3a; }
        .stat:last-child { border-right: none; }
        .stat-number { font-size: 20px; font-weight: 800; color: #c9a84c; }
        .stat-label { font-size: 11px; color: #6a6070; margin-top: 2px; }

        /* Footer */
        .footer {
            background: #0a0a0d;
            padding: 24px 40px;
            text-align: center;
            border-top: 1px solid #1a1a24;
        }
        .footer p { font-size: 11px; color: #4a4050; line-height: 1.8; }
        .footer a { color: #c9a84c; text-decoration: none; }
        .kente-strip {
            height: 4px;
            background: repeating-linear-gradient(
                90deg,
                #c9a84c 0px, #c9a84c 8px,
                #2d5a27 8px, #2d5a27 16px,
                #c0392b 16px, #c0392b 24px,
                #1a1a24 24px, #1a1a24 32px
            );
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="kente-strip"></div>

        <div class="header">
            <div class="logo">
                <img src="{{ config('app.url') }}/artemo-logo.png" alt="Artemo">
            </div>
            <div class="logo-text">ARTEMO</div>
            <div class="tagline">La musique africaine, partout avec toi</div>
        </div>

        <div class="body">
            <div class="greeting">
                Bienvenue, <span>{{ $user->name ?? $user->clientProfile?->first_name ?? explode('@', $user->email)[0] }}</span> ! 🎵
            </div>

            <p class="intro">
                Tu fais maintenant partie de la communauté Artemo — la plateforme qui célèbre et diffuse
                la musique africaine dans toute sa richesse. Explore des milliers de titres, découvre
                des artistes talentueux, et booste ta culture musicale.
            </p>

            <div class="features">
                <div class="feature-row">
                    <div class="feature">
                        <div class="feature-box">
                            <div class="feature-icon">🎧</div>
                            <div class="feature-title">ArtStream</div>
                            <div class="feature-desc">Stream illimité de musique africaine — Afrobeat, Afropop, Coupé-Décalé, Ndombolo et plus</div>
                        </div>
                    </div>
                    <div class="feature">
                        <div class="feature-box">
                            <div class="feature-icon">🎤</div>
                            <div class="feature-title">Réserver un artiste</div>
                            <div class="feature-desc">Contacte et réserve directement des artistes professionnels pour tes événements</div>
                        </div>
                    </div>
                </div>
                <div class="feature-row">
                    <div class="feature" style="padding-bottom:0">
                        <div class="feature-box">
                            <div class="feature-icon">📋</div>
                            <div class="feature-title">Playlists</div>
                            <div class="feature-desc">Crée et partage tes playlists personnalisées avec la communauté</div>
                        </div>
                    </div>
                    <div class="feature" style="padding-bottom:0">
                        <div class="feature-box">
                            <div class="feature-icon">🌍</div>
                            <div class="feature-title">15+ pays</div>
                            <div class="feature-desc">Des artistes de toute l'Afrique et de la diaspora — Cameroun, Côte d'Ivoire, Sénégal…</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="stats">
                <div class="stat">
                    <div class="stat-number">500+</div>
                    <div class="stat-label">Artistes</div>
                </div>
                <div class="stat">
                    <div class="stat-number">10K+</div>
                    <div class="stat-label">Titres</div>
                </div>
                <div class="stat">
                    <div class="stat-number">15+</div>
                    <div class="stat-label">Pays</div>
                </div>
            </div>

            <div class="cta-section">
                <a href="{{ config('app.url') }}/artstream" class="cta-btn">
                    🎵 Commencer à écouter
                </a>
            </div>

            <p style="font-size:13px; color:#6a6070; text-align:center; line-height:1.6;">
                Des questions ? Réponds à cet email ou contacte-nous à
                <a href="mailto:support@artemo.com" style="color:#c9a84c;">support@artemo.com</a>
            </p>
        </div>

        <div class="footer">
            <p>
                © {{ date('Y') }} Artemo · La musique africaine en streaming<br>
                <a href="{{ config('app.url') }}">artemo.com</a> ·
                <a href="{{ config('app.url') }}/settings/notifications">Se désabonner</a>
            </p>
        </div>

        <div class="kente-strip"></div>
    </div>
</body>
</html>
