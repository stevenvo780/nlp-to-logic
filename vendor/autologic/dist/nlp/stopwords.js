"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STOPWORDS_EN = exports.STOPWORDS_ES = void 0;
exports.isStopword = isStopword;
exports.STOPWORDS_ES = new Set([
    // Artículos
    'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas',
    // Preposiciones
    'a', 'ante', 'bajo', 'con', 'contra', 'de', 'del', 'desde', 'en', 'entre',
    'hacia', 'hasta', 'para', 'por', 'según', 'sin', 'sobre', 'tras',
    // Pronombres
    'yo', 'tú', 'él', 'ella', 'nosotros', 'nosotras', 'vosotros', 'vosotras',
    'ellos', 'ellas', 'me', 'te', 'se', 'nos', 'os', 'lo', 'le', 'les',
    'mi', 'tu', 'su', 'nuestro', 'nuestra', 'nuestros', 'nuestras',
    'vuestro', 'vuestra', 'vuestros', 'vuestras', 'suyo', 'suya', 'suyos', 'suyas',
    'este', 'esta', 'estos', 'estas', 'ese', 'esa', 'esos', 'esas',
    'aquel', 'aquella', 'aquellos', 'aquellas', 'esto', 'eso', 'aquello',
    // Verbos copulativos / auxiliares
    'es', 'ser', 'está', 'estar', 'son', 'están', 'era', 'fue', 'sido',
    'estaba', 'estaban', 'eran', 'ha', 'han', 'haber', 'he', 'has', 'hay',
    'siendo', 'estando', 'soy', 'eres', 'somos', 'sois',
    // Conjunciones / relativos
    'que', 'quien', 'cual', 'cuyo', 'cuya', 'donde', 'cuando', 'como',
    // Adverbios comunes
    'muy', 'más', 'menos', 'ya', 'aún', 'aquí', 'ahí', 'allí',
    'bien', 'mal', 'así', 'tan', 'tanto', 'mucho', 'poco',
    // Otros
    'al', 'e', 'u', 'o', 'y', 'ni', 'otro', 'otra', 'otros', 'otras',
    'mismo', 'misma', 'mismos', 'mismas', 'propio', 'propia',
    'cada', 'demás', 'ambos', 'ambas',
]);
exports.STOPWORDS_EN = new Set([
    // Articles
    'a', 'an', 'the',
    // Prepositions
    'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'about',
    'into', 'through', 'during', 'before', 'after', 'above', 'below',
    'between', 'under', 'over', 'up', 'down', 'out', 'off', 'around',
    // Pronouns
    'i', 'me', 'my', 'mine', 'myself',
    'you', 'your', 'yours', 'yourself',
    'he', 'him', 'his', 'himself',
    'she', 'her', 'hers', 'herself',
    'it', 'its', 'itself',
    'we', 'us', 'our', 'ours', 'ourselves',
    'they', 'them', 'their', 'theirs', 'themselves',
    'this', 'that', 'these', 'those',
    'who', 'whom', 'whose', 'which', 'what',
    // Verbs (copulative / aux)
    'is', 'am', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'having',
    'do', 'does', 'did', 'doing',
    'will', 'would', 'shall', 'should',
    'can', 'could', 'may', 'might',
    // Conjunctions / relative
    'and', 'or', 'but', 'nor', 'so', 'yet',
    'if', 'then', 'than', 'when', 'where', 'while', 'as',
    // Adverbs
    'very', 'too', 'also', 'just', 'only', 'now', 'here', 'there',
    'well', 'still', 'already', 'even', 'quite', 'rather',
    // Other
    'no', 'not', 'both', 'each', 'few', 'more', 'most', 'other',
    'some', 'such', 'own', 'same',
]);
/**
 * Comprueba si una palabra es stopword en el idioma dado.
 */
function isStopword(word, language = 'es') {
    const normalized = word.toLowerCase();
    const set = language === 'es' ? exports.STOPWORDS_ES : exports.STOPWORDS_EN;
    return set.has(normalized);
}
//# sourceMappingURL=stopwords.js.map