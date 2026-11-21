import { test, expect } from '@playwright/test'

test('the opening book reveals its printed inner spread', async ({ page }) => {
  await page.goto('/')

  const cover = page.locator('.opening-cover')
  await expect(cover).toBeVisible()
  await cover.evaluate(async element => {
    const opening = element.getAnimations().find(animation => animation.animationName === 'opening-cover-hinge')
    if (opening) await opening.finished
  })
  await expect(page.locator('.opening-paper')).toHaveClass(/is-open/)
  await expect(cover).toBeHidden()

  const leftPage = page.locator('.opening-leaf-left')
  await expect(leftPage.getByText('A NOTE ON THE MAKER')).toBeVisible()
  await expect(leftPage.locator('#opening-title')).toContainText('KIRTAN')

  const printedPageIsOnTop = await leftPage.locator('.opening-page-main').evaluate(element => {
    const bounds = element.getBoundingClientRect()
    const hit = document.elementFromPoint(bounds.left + bounds.width * 0.45, bounds.top + bounds.height * 0.55)
    return Boolean(hit?.closest('.opening-leaf-left'))
  })
  expect(printedPageIsOnTop).toBe(true)
  await expect(page.locator('.opening-leaf-right')).toContainText('BUSHO')
  await expect(page.locator('.opening-leaf-right')).toContainText('VARSITY')
  await expect(page.locator('.opening-leaf-right')).toContainText('ELECTROLAB')

  await page.mouse.move(120, 120)
  await expect.poll(async () => page.locator('.newspaper-opening').evaluate(element => element.style.getPropertyValue('--book-tilt-x'))).not.toBe('')
  const bookTilt = await page.locator('.opening-stage').evaluate(element => getComputedStyle(element).transform)
  expect(bookTilt).not.toBe('none')
})

test('the shared torn-paper sheet covers and reveals every navigation state', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /skip intro/i }).click()

  const sheet = page.locator('.section-burn-transition')
  await expect(sheet).toHaveClass(/is-covering/)
  const coverStyle = await sheet.evaluate(element => {
    const style = getComputedStyle(element)
    return {
      animationName: style.animationName,
      animationDuration: style.animationDuration,
      backgroundColor: style.backgroundColor,
      pointerEvents: style.pointerEvents,
      maskImage: style.maskImage,
      clipPath: style.clipPath,
    }
  })
  expect(coverStyle.animationName).toContain('torn-sheet-cover')
  expect(coverStyle.animationDuration).toBe('0.92s')
  expect(coverStyle.backgroundColor).toBe('rgb(32, 33, 29)')
  expect(coverStyle.pointerEvents).toBe('none')
  expect(coverStyle.maskImage).toBe('none')
  expect(coverStyle.clipPath).toBe('none')
  await expect(page.locator('.section-transition-edge')).toHaveCount(1)

  // Content swaps while the dark sheet fully covers the viewport; the same
  // sheet then lifts away to reveal the new state.
  await expect(page.locator('.newspaper-opening')).toHaveCount(0, { timeout: 1800 })
  await expect(sheet).toHaveClass(/is-revealing/)
  const revealName = await sheet.evaluate(element => getComputedStyle(element).animationName)
  expect(revealName).toContain('torn-sheet-reveal')
  await expect(sheet).toHaveCount(0, { timeout: 1800 })

  await page.locator('.masthead-index-prompt').click()
  await expect(sheet).toHaveClass(/is-covering/)
  await expect(page.locator('.index-overlay')).toHaveClass(/is-open/, { timeout: 1800 })
  await expect(sheet).toHaveClass(/is-revealing/)
  await expect(sheet).toHaveCount(0, { timeout: 1800 })
})
