# Futurystyczne CV w HTML

## 📋 Opis

Profesjonalne, nowoczesne CV w HTML z możliwością eksportu do PDF. Stonowane kolory zapewniają czytelność w wersji drukowanej przy zachowaniu futurystycznego wyglądu.

## 🎨 Paleta Kolorów

### Tryb Przeglądarkowy (Screen)
- **Primary Blue**: `#0ea5e9` (Sky Blue) - główny kolor akcentowy
- **Secondary Purple**: `#6366f1` (Indigo) - dodatkowy akcent
- **Accent Green**: `#059669` (Emerald) - podkreślenia
- **Tło**: Ciemny gradient z subtelnymi animacjami

### Tryb PDF/Druku (Print)
- **Primary**: `#0369a1` (ciemniejszy niebieski)
- **Secondary**: `#4338ca` (głębszy fiolet)
- **Accent**: `#047857` (ciemniejsza zieleń)
- **Tło**: Białe z jasnoszarymi kartami
- **Tekst**: `#1e293b` (ciemnoszary, wysoka czytelność)

## ✨ Funkcje

1. **Eksport do PDF** - przycisk w prawym górnym rogu
2. **Animacje Scroll** - elementy pojawiają się podczas przewijania
3. **Efekt Pisania** - dynamiczny tekst w nagłówku
4. **Responsywny Design** - działa na wszystkich urządzeniach
5. **Interaktywne Elementy** - hover effects, animacje
6. **Easter Egg** - kod Konami (↑↑↓↓←→←→BA)

## 🚀 Jak Użyć

1. Otwórz `index.html` w przeglądarce
2. Dostosuj swoje dane w HTML
3. Kliknij "Pobierz PDF" aby wyeksportować

## 📝 Personalizacja

### Zmiana Danych Osobowych
W pliku `index.html` znajdź sekcję `<header class="header-section">` i zmień:
- Inicjały w `<span class="avatar-placeholder">JK</span>`
- Imię i nazwisko w `<h1 class="glitch" data-text="Jan Kowalski">Jan Kowalski</h1>`
- Stanowisko w `<p class="job-title">Senior Full-Stack Developer</p>`
- Dane kontaktowe w sekcji `contact-grid`

### Dostosowanie Umiejętności
Znajdź sekcję `<section class="section skills-section">` i:
- Zmień nazwy technologii
- Dostosuj poziomy umiejętności (zmień `style="--progress: 95%"`)
- Dodaj/usuń kategorie

### Zmiana Doświadczenia
W sekcji `<section class="section experience-section">`:
- Edytuj stanowiska, firmy i daty
- Dostosuj listę osiągnięć
- Zmień tagi technologii

### Modyfikacja Kolorów
W pliku `styles.css` w sekcji `:root` możesz zmienić:
```css
--primary-color: #0ea5e9;    /* Główny kolor */
--secondary-color: #6366f1;   /* Dodatkowy akcent */
--accent-color: #059669;      /* Podkreślenia */
```

## 🖨️ Optymalizacja PDF

CV jest zoptymalizowane pod eksport do PDF:
- Automatyczna zmiana kolorów na bardziej kontrastowe
- Usunięcie animacji i efektów tła
- Białe tło z jasnoszarymi kartami
- Czarny tekst dla maksymalnej czytelności
- Poprawne łamanie stron

## 📱 Responsywność

CV automatycznie dostosowuje się do rozmiaru ekranu:
- Desktop: Pełny layout z wszystkimi efektami
- Tablet: Dostosowane siatki i odstępy
- Mobile: Jednkolumnowy layout, mniejsze czcionki

## 🔧 Wymagania

- Nowoczesna przeglądarka (Chrome, Firefox, Edge, Safari)
- JavaScript włączony
- Połączenie internetowe (dla biblioteki html2pdf.js z CDN)

## 💡 Wskazówki

1. **Najlepsza jakość PDF**: Użyj Chrome do generowania PDF
2. **Drukowanie**: Możesz też użyć Ctrl+P zamiast przycisku "Pobierz PDF"
3. **Edycja**: Zmiany w HTML natychmiast widoczne po odświeżeniu strony
4. **Testowanie**: Sprawdź PDF przed wysłaniem do pracodawcy

## 🎯 Zalety tego CV

- ✅ Profesjonalny i nowoczesny wygląd
- ✅ Doskonała czytelność w PDF
- ✅ Łatwe w edycji i personalizacji
- ✅ Nie wymaga frameworków czy buildowania
- ✅ Działa offline (po pierwszym załadowaniu)
- ✅ Responsywne i dostępne
- ✅ Wyróżnia się spośród tradycyjnych CV

## 📄 Struktura Plików

```
CVHtml/
├── index.html      # Główny plik HTML z treścią CV
├── styles.css      # Style i animacje
├── script.js       # Interaktywność i eksport PDF
└── README.md       # Ten plik
```

---

**Powodzenia w poszukiwaniu pracy! 🚀**
