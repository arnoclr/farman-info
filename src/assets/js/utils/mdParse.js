// https://codepen.io/kvendrik/pen/Gmefv?editors=0010

const parseMd = (md, forQuill = false) => {

  // checklist
  // md = md.replace(/\* \[(x| )\]/g, function(string, cross) {
  //   return `<input type="checkbox" class="fm-md-checkbox" ${cross == 'x' ? 'checked' : ''}>`;
  // });

  // youtube link
  md = md.replace(/(https?:\/\/)?(www.)?youtube.(com|be)\/(watch\?v=)?([a-zA-Z0-9_-]+)/g,
    '<div class="video-container"><iframe class="skeleton" width="560" height="315" src="https://www.youtube.com/embed/$5" frameborder="0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe></div>');

  // twitter embed
  md = md.replace(/(https?:\/\/)twitter.com\/[a-zA-Z0-9_]{0,15}\/status\/(\d+)/g, url => {
    return `<div class="video-container"><iframe border=0 frameborder=0 height=250 width=550 src="https://twitframe.com/show?url=${url}"></iframe></div>`
  })
  
  return md;
}

export {parseMd}