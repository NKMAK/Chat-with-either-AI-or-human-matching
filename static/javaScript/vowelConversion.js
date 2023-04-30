export function vowelConversion(originMassage) {
    const replacements = {
        "あ":"あ",
        "い":"い",
        "う":"う",
        "え":"え",
        "お":"お",
        "か": "あ",
        "き": "い",
        "く": "う",
        "け": "え",
        "こ": "お",
        "さ": "あ",
        "し": "い",
        "す": "う",
        "せ": "え",
        "そ": "お",
        "た": "あ",
        "ち": "い",
        "つ": "う",
        "て": "え",
        "と": "お",
        "な": "あ",
        "に": "い",
        "ぬ": "う",
        "ね": "え",
        "の": "お",
        "は": "あ",
        "ひ": "い",
        "ふ": "う",
        "へ": "え",
        "ほ": "お",
        "ま": "あ",
        "み": "い",
        "む": "う",
        "め": "え",
        "も": "お",
        "や": "あ",
        "ゆ": "う",
        "よ": "お",
        "ら": "あ",
        "り": "い",
        "る": "う",
        "れ": "え",
        "ろ": "お",
        "わ": "あ",
        "を": "お",
        "ん": "ん",
    };
    let result = "";
  
    for (let i = 0; i < originMassage.length; i++) {
      const char = originMassage[i];
      if (replacements[char]) {
        result += replacements[char];
      }
      else{
        const chars = ['あ', 'い', 'う', 'え', 'お'];
        const randomIndex = Math.floor(Math.random() * chars.length);
        result+=chars[randomIndex];
      }
    }
    console.log(result)
    return result;
  }
  