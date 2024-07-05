
function extractPokemonData(dataString) {
    const pattern = /`(\d+)`\s*\*\*<:_:\d+>\s*✨\s*Level\s*\d+\s*(.+?)<:(?:male|unknown|female):\d+>\*\*\s*•\s*([\d.]+)%\s*•\s*([\d,]+)\s*pc/;

    const match = dataString.match(pattern);

    if (match) {
        const id = match[1];
        const name = match[2];
        const iv = match[3];
        const price = match[4].replace(/,/g, '');
        
        return {
            id: id,
            name: name,
            iv: iv,
            price: price
        };
    } else {
        return null;
    }
}
module.exports = extractPokemonData;
