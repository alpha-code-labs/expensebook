function titleCase(str){
    str = str.toLowerCase().split(' ').map(word=>word.replace(word[0],word[0].toUpperCase()))
    return str.join(' ')
}

export {titleCase}