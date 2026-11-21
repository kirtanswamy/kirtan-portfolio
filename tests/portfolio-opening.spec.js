import { test, expect } from '@playwright/test'

test('the opening book reveals its printed inner spread', async ({ page }) => {
  await page.goto('/')

  const cover = page.locator('.opening-cover')
  await expect(cover).toBeVisible()
  await cover.evaluate(async element => {
    const opening = element.getAnimations().find(animation => animation.animationName === 'opening-cover-hinge')
    if (opening) await opening.finished
  })

  const leftPage = page.locator('.opening-leaf-left')
  await expect(leftPage.getByText('A NOTE ON THE MAKER')).toBeVisible()
  await expect(leftPage.locator('#opening-title')).toContainText('KIRTAN')

  const printedPageIsOnTop = await leftPage.locator('.opening-page-main').evaluate(element => {
    const bounds = element.getBoundingClientRect()
    const hit = document.elementFromPoint(bounds.left + bounds.width * 0.45, bounds.top + bounds.height * 0.55)
    return Boolean(hit?.closest('.opening-leaf-left'))
  })
  expect(printedPageIsOnTop).toBe(true)
})

test('the page burn travels down the sheet and leaves controls clickable', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /skip intro/i }).click()

  await expect(page.locator('.newspaper-opening')).toHaveCount(0)
  const burn = page.locator('.section-burn-transition')
  await expect(burn).toBeVisible()

  const transitionStyle = await burn.evaluate(element => {
    const style = getComputedStyle(element)
    return {
      clipPath: style.clipPath,
      maskImage: style.maskImage,
      pointerEvents: style.pointerEvents,
      animationName: style.animationName,
    }
  })

  expect(transitionStyle.clipPath).toContain('polygon')
  expect(transitionStyle.maskImage).toBe('none')
  expect(transitionStyle.pointerEvents).toBe('none')
  expect(transitionStyle.animationName).toContain('burn-page-down')

  await page.locator('.masthead-index-prompt').click({ timeout: 1000 })
  await expect(page.locator('.index-overlay')).toHaveClass(/is-open/, { timeout: 1000 })
})
