export const shareOnX = (name: string, prompt: string) => {
  const intentUrl =
    'https://twitter.com/intent/tweet?text=' +
    encodeURIComponent('My latest #AIart creation with Imagine #Heurist 🎨') +
    '&url=' +
    encodeURIComponent(`https://imagine.heurist.ai/share/${name}`) +
    '\n Prompt: ' +
    prompt
  window.open(intentUrl, '_blank', 'width=550,height=420')
}
