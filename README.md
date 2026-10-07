# Voicebot Research

Prototyp konwersacyjnego voicebota przygotowany w ramach researchu narzędzi do tworzenia asystentów głosowych.

## Aktualnie przetestowane rozwiązanie

OpenAI Realtime API.

Voicebot:
- prowadzi rozmowę głosową w czasie rzeczywistym,
- obsługuje język angielski, niemiecki i polski,
- umożliwia zmianę języka w trakcie rozmowy,
- wykrywa koniec wypowiedzi użytkownika,
- obsługuje przerywanie odpowiedzi przez użytkownika,
- ogranicza rozmowę do zadanego tematu,
- tworzy transkrypcję rozmowy,
- generuje końcowe podsumowanie rozmowy.

## Scenariusz testowy

Scenariusz dotyczy preferencji użytkownika związanych z weekendowym wyjazdem.

Bot zbiera informacje dotyczące:
- rodzaju miejsca / celu wyjazdu,
- budżetu,
- transportu,
- noclegu,
- preferowanych aktywności.

## Wyniki testu OpenAI Realtime

W przeprowadzonych testach poprawnie działały:
- rozpoznawanie mowy,
- turn detection,
- barge-in,
- ograniczenie rozmowy do zadanego tematu,
- obsługa języka angielskiego i niemieckiego,
- zmiana języka w trakcie rozmowy,
- transkrypcja użytkownika i bota,
- generowanie końcowego podsumowania.

Średnie zmierzone latency wyniosło około 0,30 s.

## Technologie

- Python
- FastAPI
- JavaScript
- WebRTC
- OpenAI Realtime API
- OpenAI Responses API

## Struktura projektu

voicebot-research/
├── static/
│   ├── index.html
│   └── app.js
├── app.py
├── requirements.txt
├── README.md
└── .gitignore

## Uruchomienie

1. Utwórz środowisko wirtualne.

2. Zainstaluj zależności:

    pip install -r requirements.txt

3. Utwórz plik `.env` i dodaj:

    OPENAI_API_KEY=your_api_key

4. Uruchom aplikację:

    uvicorn app:app --reload

5. Otwórz w przeglądarce:

    http://127.0.0.1:8000

## Uwagi

Plik `.env` nie powinien być dodawany do repozytorium, ponieważ zawiera klucz API.