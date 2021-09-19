// https://codepen.io/kvendrik/pen/Gmefv?editors=0010

const parseMd = (md, forQuill = false) => {

  // checklist
  // md = md.replace(/\* \[(x| )\]/g, function(string, cross) {
  //   return `<input type="checkbox" class="fm-md-checkbox" ${cross == 'x' ? 'checked' : ''}>`;
  // });

  // youtube link
  md = md.replace(/(https?:\/\/)?(www.)?youtube.(com|be)\/(watch\?v=)?([a-zA-Z0-9_-]+)(\&.+)?/g,
    `<div class="fm-section--video-with-button">
      <div class="video-container">
        <iframe class="skeleton" width="560" height="315" 
          src="https://www.youtube.com/embed/$5" frameborder="0" 
          allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen>
        </iframe>
      </div>
      <a class="fm-button fm-button--full"
        href="https://youtu.be/$5" target="_blank" title="Ouvrir sur youtube.com">
        Regarder sur youtube <i class="material-icons fm-button__icon fm-button__icon--right">play_arrow</i>
      </a>
    </div>`);

  // twitter embed
  md = md.replace(/(https?:\/\/)twitter.com\/[a-zA-Z0-9_]{0,15}\/status\/(\d+)/g, url => {
    return `
      <div class="fm-section--video-with-button">
        <div class="video-container">
          <iframe border=0 frameborder=0 height=250 width=550 src="https://twitframe.com/show?url=${url}"></iframe>
        </div>
        <a class="fm-button fm-button--full"
          href="https://twitter.com/intent/follow?original_referer=https%3A%2F%2Ffarman.info%2F&screen_name=ActualitsArona1"
          target="_blank" title="Suivre Farman sur Twitter">
          Suivre Farman sur Twitter
        </a>
      </div>`
  })
  
  return md;
}

export {parseMd}