function get_translation(key) {
    var translations = {
        "en": {
            "hello": "Hello",
            "goodbye": "Goodbye"
        },
        "fr": {
            "hello": "Bonjour",
            "goodbye": "Au revoir"
        }
    };
    return translations[key]; // 返回对应语言的翻译
}