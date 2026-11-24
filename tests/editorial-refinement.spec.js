import { test, expect } from '@playwright/test'

test('the editorial refinement layer is loaded and keeps the page within the viewport', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await expect(page.locator('.newspaper-opening')).toHaveCount(0, { timeout: 3000 })

  await expect(page.locator('.hero')).toBeVisible()
  await expect(page.locator('.projects-shelf .project-card')).toHaveCount(5)

  const refinementToken = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue('--editorial-refinement-ready').trim(),
  )
  expect(refinementToken).toBe('1')

  for (const width of [360, 390, 768, 1024, 1280, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    const dimensions = await page.evaluate(() => ({
      viewport: window.innerWidth,
      document: document.documentElement.scrollWidth,
      body: document.body.scrollWidth,
    }))
    expect(dimensions.document, `document overflow at ${width}px`).toBeLessThanOrEqual(dimensions.viewport)
    expect(dimensions.body, `body overflow at ${width}px`).toBeLessThanOrEqual(dimensions.viewport)
  }
})

test('the refined project shelf retains keyboard access and reduced-motion feedback', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.locator('.newspaper-opening')).toHaveCount(0, { timeout: 3000 })

  const shelf = page.getByRole('region', { name: /horizontally browsable featured project archive/i })
  await expect(shelf).toBeVisible()
  await shelf.focus()
  const nextProject = page.getByRole('button', { name: 'Next project' })
  for (let index = 0; index < 4; index += 1) await page.keyboard.press('ArrowRight')
  await expect.poll(() => shelf.evaluate(element => element.scrollLeft)).toBeGreaterThan(0)

  await expect(page.locator('.shelf-counter')).toContainText('05')
  const finalBook = page.locator('.project-card').last().getByRole('button', { name: /open the chhutti ke baad project book/i })
  await finalBook.scrollIntoViewIfNeeded()
  await finalBook.click()
  await expect(page.getByRole('dialog', { name: /chhutti ke baad/i })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toHaveCount(0)
})
