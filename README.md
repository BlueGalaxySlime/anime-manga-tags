# Anime & Manga Tag Search

Interaktywny system tagów do wyszukiwania, filtrowania i katalogowania postów anime/manga. Projekt oparty o GitHub Pages jako alternatywa dla ograniczeń Blogspot.

## 🔍 Funkcje

- Wybór tagów z podziałem na grupy i podgrupy (np. „Czas i Miejsce”, „Gatunki”)
- Automatyczne zapisywanie wybranych tagów w `localStorage`
- Eksport wyników do CSV i JSON
- Prosty edytor tagów online (`edytor.html`)
- Stylowe etykiety z interakcją
- Przejrzysty podział wyników według kategorii

## 🌐 Demo (GitHub Pages)

[anime-manga-tags – GitHub Pages](https://bluegalaxyslime.github.io/anime-manga-tags/)

## 📁 Struktura repozytorium
Wyszukiwarka:
- index.html - Wybór tagów (wyszukiwarka)
- wyniki.html - Wyświetlanie wyników z eksportem
- style.css - Style wizualne
- script.js - Logika działania wyszukiwarki i localStorage
- tagi.json - Główna baza tagów
- edytor.html - Edytor tagów JSON. Edytor tagów online (dodawanie/usuwanie)
- edytor.js - Skrypt dla edytora. Logika edytora tagów
- README.md - Ten plik
Post blogspot:
- generator.html – Generator kodu HTML z tagami do posta
- blogspot-tags.js – Skrypt do wklejenia w poście, który dodaje kliknięcie na tagi

## ✏️ Przyszłe plany

- Dodanie opisu tagów (tooltipy lub osobna sekcja)
- Obsługa na urządzeniach mobilnych
- Grupy nadrzędne z zależnościami logicznymi
- Eksport i import całych konfiguracji tagów

## ⚙️ Jak edytować tagi?

1. Otwórz `edytor.html`
2. Wklej nową strukturę tagów
3. Kliknij „Zapisz” (zapisze do `localStorage`)
4. Skopiuj dane do `tagi.json` na GitHubie

## 📜 Licencja

Projekt dostępny na licencji MIT — możesz używać, kopiować i modyfikować.

---

> Stworzone z myślą o organizowaniu świata anime i mangi ✨
