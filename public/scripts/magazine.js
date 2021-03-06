let url = window.magazine.url

var pdfjsLib = window['pdfjs-dist/build/pdf']

var pdfDoc = null
var pageNum = 1
var pageCount = null
var pageRendering = false
var pageNumPending = null
var pageFlip = null
var summaryRendered = false
var container = document.getElementById('container')
var summary = document.querySelector('.summary')
var summaryScroll = document.querySelector('.summary .scroll')
var landing = document.getElementById('landing')
var startReading = document.getElementById('start-reading')
var canvasTop = document.getElementById('pdf-top')
var canvasBtm = document.getElementById('pdf-btm')
var summaryTrigger = document.getElementById('summary-trigger')
var ctxTop = canvasTop.getContext('2d')
var ctxBtm = canvasBtm.getContext('2d')

/**
 * Get page info from document, resize canvas accordingly, and render page.
 * @param num Page number.
 */
function renderPage (num, canvas, ctx, scale = 1) {
  pageRendering = true
  // Using promise to fetch the page
  pdfDoc.getPage(num).then(function (page) {
    let viewport = page.getViewport({ scale: scale })
    canvas.height = viewport.height
    canvas.width = viewport.width

    // Render PDF page into canvas context
    var renderContext = {
      canvasContext: ctx,
      viewport: viewport
    }
    var renderTask = page.render(renderContext)

    // Wait for rendering to finish
    renderTask.promise.then(function () {
      pageRendering = false
      if (pageNumPending !== null) {
        // New page rendering is pending
        renderPage(pageNumPending, canvas, ctx)
        pageNumPending = null
      }
    })
  })

  // Update page counters
  document.getElementById('page_num').textContent = num
  document.getElementById('pdf-progress').value = pageNum / pageCount * 100
}

/**
 * If another page rendering in progress, waits until the rendering is
 * finised. Otherwise, executes rendering immediately.
 */
function queueRenderPage (num, canvas, ctx, scale = 1) {
  if (pageRendering) {
    pageNumPending = num
  } else {
    renderPage(num, canvas, ctx, scale)
  }
}

/**
 * Displays previous page.
 */
function onPrevPage () {
  if (pageNum <= 1 || pageFlip) return
  pageFlip = true
  pageNum--
  resetCanvasPos()
  queueRenderPage(pageNum, canvasTop, ctxTop)
  canvasTop.removeAttribute('class')
  canvasTop.style.display = 'block'
  setTimeout(e => {
    canvasTop.classList.add('in')
  }, 10)
  setTimeout(e => {
    queueRenderPage(pageNum, canvasBtm, ctxBtm)
    canvasTop.style.display = 'none'
    pageFlip = false
  }, 350)
}
document.getElementById('prev').addEventListener('click', onPrevPage)

/**
 * Displays next page.
 */
function onNextPage () {
  if (pageNum >= pdfDoc.numPages || pageFlip) return
  pageFlip = true
  pageNum++
  resetCanvasPos()
  queueRenderPage(pageNum, canvasBtm, ctxBtm)
  canvasTop.removeAttribute('class')
  canvasTop.style.display = 'block'
  setTimeout(e => {
    canvasTop.classList.add('out')
  }, 10)
  setTimeout(e => {
    queueRenderPage(pageNum, canvasTop, ctxTop)
    pageFlip = false
  }, 350)
}
document.getElementById('next').addEventListener('click', onNextPage)

function resetCanvasPos () {
  canvasBtm.style.removeProperty('transform')
  canvasBtm.style.removeProperty('left')
  canvasBtm.style.removeProperty('top')
}

function hammerIt (elm) {
  hammertime = new Hammer(elm, {})
  hammertime.get('pinch').set({
    enable: true
  })
  var posX = 0;
    var posY = 0;
    var scale = 1;
    var last_scale = 1;
    var last_posX = 0;
    var last_posY = 0;
    var max_pos_x = 0;
    var max_pos_y = 0;
    var transform = "";
    var el = elm

  hammertime.on('doubletap pan pinch panend pinchend', function (ev) {
    if (ev.type == 'doubletap') {
      transform =
        'translate3d(-50%, -50%, 0) ' +
        'scale3d(2, 2, 1) ';
      scale = 2
      last_scale = 2
      try {
        if (window.getComputedStyle(el, null).getPropertyValue('-webkit-transform').toString() != 'matrix(1, 0, 0, 1, 0, 0)') {
          transform =
            'translate3d(0, 0, 0) ' +
            'scale3d(1, 1, 1) ';
          scale = 1
          last_scale = 1
        }
      } catch (err) {}
      el.style.webkitTransform = transform
      transform = '';
      queueRenderPage(pageNum, canvasBtm, ctxBtm, scale)
    }

    // pan
    posY = last_posY + ev.deltaY
    if (scale != 1) {
      posX = last_posX + ev.deltaX
      max_pos_x = Math.ceil((scale - 1) * el.clientWidth / 2)
      max_pos_y = Math.ceil((scale - 1) * el.clientHeight / 2)
      if (posX > max_pos_x) {
        posX = max_pos_x
      }
      if (posX < -max_pos_x) {
        posX = -max_pos_x
      }
      if (posY > max_pos_y) {
        posY = max_pos_y
      }
      if (posY < -max_pos_y) {
        posY = -max_pos_y
      }
    }

    if (scale < 1.1) {
      // detect pan down / up to dropdown summary
      console.log(posY, last_posY)
      if (posY > last_posY + 50) {
        summary.classList.add('open')
      } else if (posY < last_posY + 50) {
        summary.classList.remove('open')
      }
    }

    // pinch
    if (ev.type == 'pinch') {
      scale = Math.max(0.999, Math.min(last_scale * (ev.scale), 4))
    }
    if (ev.type == 'pinchend') {
      last_scale = scale
      queueRenderPage(pageNum, canvasBtm, ctxBtm, scale)
    }

    // panend
    if (ev.type == 'panend') {
      last_posX = posX < max_pos_x ? posX : max_pos_x
      last_posY = posY < max_pos_y ? posY : max_pos_y
    }

    if (scale != 1) {
      transform =
        'translate3d(' + posX + 'px,' + posY + 'px, 0) ' +
        'scale3d(' + scale + ', ' + scale + ', 1)';
    }

    if (transform) {
      el.style.webkitTransform = transform
    }
  })
}

summaryTrigger.addEventListener('click', e => {
  summary.classList.toggle('open')
  renderSummary()
})

function makeThumb (page) {
  // draw page to fit into 96x96 canvas
  let vp = page.getViewport({ scale: 1 })
  var canvas = document.createElement('canvas')
  var scalesize = 1
  canvas.width = vp.width * scalesize
  canvas.height = vp.height * scalesize
  var scale = Math.min(canvas.width / vp.width, canvas.height / vp.height)
  console.log(vp.width, vp.height, scale)
  return page.render({ canvasContext: canvas.getContext('2d'), viewport: page.getViewport({ scale: scale }) }).promise.then(function () {
    return canvas
  })
}

function renderSummary () {
  if (summaryRendered) return
  pdfjsLib.getDocument(url).promise.then(function (doc) {
    let pages = []; while (pages.length < doc.numPages) pages.push(pages.length + 1)
    return Promise.all(pages.map(function (num) {
      return doc.getPage(num).then(makeThumb)
        .then(function (canvas) {
          canvas.addEventListener('click', e => {
            queueRenderPage(num, canvasBtm, ctxBtm)
            queueRenderPage(num, canvasTop, ctxTop)
          })
          summaryScroll.appendChild(canvas)
        })
    }))
  }).catch(console.error)
  summaryRendered = true
}

startReading.addEventListener('click', e => {
  landing.style.display = 'none'
  container.style.display = 'block'
  container.requestFullscreen()
})

landing.innerHTML +=
`<h1>${window.magazine.title}</h1>
<p>${window.magazine.summary}</p>`

hammerIt(canvasBtm)

pdfjsLib.getDocument(url).promise.then(function (pdfDoc_) {
  pdfDoc = pdfDoc_
  pageCount = pdfDoc.numPages
  document.getElementById('page_count').textContent = pageCount

  pdfDoc.getPage(1).then(makeThumb).then(canvas => {
    landing.appendChild(canvas)
  })

  // Initial/first page rendering
  renderPage(pageNum, canvasBtm, ctxBtm)
  renderPage(pageNum, canvasTop, ctxTop)
})
