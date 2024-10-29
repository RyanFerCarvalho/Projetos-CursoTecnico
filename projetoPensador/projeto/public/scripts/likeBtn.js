const likeBtn = document.getElementsByClassName('thoughtLikeBtn')

for (const button of likeBtn) {
  const likesAmountSpan = button.parentElement.children[0]

  button.addEventListener('click', async () => {
    if (button.src === 'http://localhost:4004/assets/svgs/heart.svg') {
      await fetch(`http://localhost:4004/thoughts/createlike/${button.parentElement.id}`)
        .then(response => {
          if (response.redirected) {
            window.location.href = response.url
          } else {
            likesAmountSpan.textContent++

            button.src = '/assets/svgs/heartFill.svg'
          }
        })
    } else {
      await fetch(`http://localhost:4004/thoughts/deletelike/${button.parentElement.id}`)
        .then(response => {
          if (response.redirected) {
            window.location.href = response.url
          } else {
            button.src = '/assets/svgs/heart.svg'

            likesAmountSpan.textContent--
          }
        })
    }
  })
}
