export const translations = {
	ru: {
		"catalog_hero_title": "Наше меню",
		"catalog_hero_subtitle": "Попробуйте наши авторские блюда, изысканные напитки и великолепные десерты.",
		"catalog_category_starters_salads": "Закуски и салаты",
		"catalog_category_soups": "Супы",
		"catalog_category_main_dishes": "Основные блюда",
		"catalog_category_desserts": "Десерты",
		"catalog_category_beverages": "Напитки",
		"catalog_category_main_drinks": "Основные напитки",
		"catalog_category_specialty_drinks": "Особые напитки",
		"catalog_add_btn": "В корзину",
		"catalog_added_label": "Добавлено"
	},
	en: {
		"catalog_hero_title": "Our Menu",
		"catalog_hero_subtitle": "Discover our carefully crafted dishes, specialty beverages, and delightful desserts.",
		"catalog_category_starters_salads": "Starters & Salads",
		"catalog_category_soups": "Soups",
		"catalog_category_main_dishes": "Main Dishes",
		"catalog_category_desserts": "Desserts",
		"catalog_category_beverages": "Beverages",
		"catalog_category_main_drinks": "Main Drinks",
		"catalog_category_specialty_drinks": "Specialty Drinks",
		"catalog_add_btn": "Add to cart",
		"catalog_added_label": "Added"
	},
	az: {
		"catalog_hero_title": "Menyumuz",
		"catalog_hero_subtitle": "Özəl olaraq hazırlanmış təamlarımızı, xüsusi içkilərimizi və ləzzətli desertlərimizi kəşf edin.",
		"catalog_category_starters_salads": "Qəlyanaltılar və salatlar",
		"catalog_category_soups": "Şorbalar",
		"catalog_category_main_dishes": "Əsas yeməklər",
		"catalog_category_desserts": "Desertlər",
		"catalog_category_beverages": "İçkilər",
		"catalog_category_main_drinks": "Əsas içkilər",
		"catalog_category_specialty_drinks": "Xüsusi içkilər",
		"catalog_add_btn": "Səbətə əlavə et",
		"catalog_added_label": "Əlavə edildi"
	}
};
export const getCatalogTranslation = (lang, dataId) => {
	const dict = translations[lang] || translations.ru;
	return dict[dataId] || translations.en[dataId] || dataId;
};
export const getCategoryTitle = (lang, originalCat) => {
	const normalized = (originalCat || "").trim().toLowerCase();
	if (normalized === "starters & salads" || normalized === "starters and salads" || normalized === "starters" || normalized === "salads") {
		return getCatalogTranslation(lang, "catalog_category_starters_salads");
	}
	if (normalized === "soups" || normalized === "soup") {
		return getCatalogTranslation(lang, "catalog_category_soups");
	}
	if (normalized === "main dishes" || normalized === "main dish" || normalized === "mains") {
		return getCatalogTranslation(lang, "catalog_category_main_dishes");
	}
	if (normalized === "desserts" || normalized === "dessert") {
		return getCatalogTranslation(lang, "catalog_category_desserts");
	}
	if (normalized === "beverages" || normalized === "beverage" || normalized === "drinks") {
		return getCatalogTranslation(lang, "catalog_category_beverages");
	}
	if (normalized === "main drinks") {
		return getCatalogTranslation(lang, "catalog_category_main_drinks");
	}
	if (normalized === "specialty drinks") {
		return getCatalogTranslation(lang, "catalog_category_specialty_drinks");
	}
	return originalCat;
};
