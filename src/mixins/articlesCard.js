const REGEX_IMG = /!\[[^\]]*\]\((.*?)\s*("(?:.*[^"])")?\s*\)/g
const REGEX_MD_SYMBOLS = /(\*|[#]+ |_)/g

export const articleCardMixin = {
    methods: {
        getImageFromContent(content) {
            let matchs = REGEX_IMG.exec(content)
            return matchs ? matchs[1] : null
        },
        removeMdFromContent(content) {
            return content.replace(REGEX_IMG, '').replace(REGEX_MD_SYMBOLS, '')
        },
    }
}