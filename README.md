# North Star Bakery

Touchstone 4 continues the Touchstone 2 and 3 website for North Star Bakery. The project has four HTML pages, shared responsive styles, supplied bakery assets, and a JavaScript file for the product favorites and pre-order form validation.

## Preview

Run `python3 -m http.server 8000` from this folder, then open `http://localhost:8000`.

## Touchstone 4 features

- On `products.html`, customers can save or remove bakery favorites. Favorites are stored in `localStorage` and restored when the menu is revisited.
- On `contact.html`, JavaScript validates name, email, pickup date, request type, and item details. Inline messages explain what to fix, and valid entries stay in place while the page shows a confirmation preview.

The form is a front-end demonstration and has no server endpoint, so it does not send a request to the bakery. Address, hours, phone, and team names remain placeholders because the client details were not supplied. Product prices are labeled as sample ranges.
