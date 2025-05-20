def generate_krishna_response(query, verses, lang, memory=None):
    if verses:
        top = verses[0]
        # Compose response with context and commentary
        return (
            f"{top['text']} ({'Bhagavad Gita' if lang=='en' else 'バガヴァット・ギーター'} {top['chapter']}:{top['verse']})\n"
            f"{top.get('context', '')}\n"
            f"{top.get('commentary', '')}"
        )
    else:
        return (
            "O Arjuna, reflect upon your question. The answer lies within the teachings of the Gita."
            if lang == "en" else
            "アルジュナよ、問いを内省しなさい。答えはギーターの教えの中にあります。"
        )

def personalize_guidance(situation, verses, lang):
    if verses:
        return generate_krishna_response(situation, verses, lang)
    else:
        return (
            "Describe your situation further, O Arjuna, and I shall guide you."
            if lang == "en" else
            "さらに状況を説明しなさい、アルジュナよ。導きを与えましょう。"
        )