const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')
const { get } = require('http')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {

    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Ossi Myllymäki',
        username: 'Ozzone',
        password: 'Trocadero'
      }
    })

    await page.goto('')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.locator('text=username')).toBeVisible()
    await expect(page.locator('text=password')).toBeVisible()
  })
  
  test('user can log in', async ({ page }) => {
    await loginWith(page, 'Ozzone', 'Trocadero')
    await expect(page.getByText('Ossi Myllymäki logged in')).toBeVisible()
  })

  test('login fails with wrong password', async ({ page }) => {
    await loginWith(page, 'Ozzone', 'wrong')

    const errorDiv = await page.locator('.error')
    await expect(errorDiv).toContainText('Wrong credentials')
    await expect(errorDiv).toHaveCSS('border-style', 'solid')
    await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
    await expect(page.getByText('Ossi Myllymäki logged in')).not.toBeVisible()
  })

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'Ozzone', 'Trocadero')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'a blog created by playwright', 'playwright', 'https://playwright.dev/')
      await expect(page.locator('text=a blog created by playwright').first()).toBeVisible()
    })

    describe('and a blog exists', () => {

      beforeEach(async ({ page }) => {
        await createBlog(page, 'a blog created by playwright', 'playwright', 'https://playwright.dev/')
      })

      test('a blog can be liked', async ({ page }) => {
        await page.locator('text=view').first().click()
        await page.locator('text=like').first().click()
        await expect(page.locator('text=likes 1').first()).toBeVisible()
      })

      test('a blog can be deleted', async ({ page }) => {
        await page.locator('text=view').first().click()
        await page.locator('text=remove').first().click()
        await expect(page.locator('text=a blog created by playwright').first()).not.toBeVisible()
      })

      test('Only the creator can see the remove button', async ({ page, request }) => {
        await page.locator('text=logout').first().click()
        await request.post('/api/users', {
          data: {
            name: 'Akseli Kampi',
            username: 'Aksu',
            password: 'Kampi'
          }
        })
        await loginWith(page, 'Aksu', 'Kampi')
        await expect(page.locator('text=a blog created by playwright').first()).toBeVisible()
        await page.locator('text=view').first().click()
        await expect(page.locator('text=remove').first()).not.toBeVisible()
      })

      test('Blogs are ordered by likes', async ({ page }) => {
        // Close the create blog form
        await page.getByRole('button', { name: 'cancel' }).first().click()
        // Create a new blog
        await createBlog(page, 'another blog created by playwright', 'playwright', 'https://playwright.dev/')
        // Open the detailed view for both blogs
        await page.getByRole('button', { name: 'view' }).first().click()
        await page.getByRole('button', { name: 'view' }).last().click()
        // Like the first blog once
        await page.locator('text=like').first().click()
        await page.locator('text=likes 1').waitFor()
        // Like the second blog twice
        const secondLikeButton = await page.locator('text=like').last()
        await secondLikeButton.click()
        await secondLikeButton.locator('..').locator('text=likes 1').waitFor()
        await secondLikeButton.click()
        await page.locator('text=likes 2').waitFor()
        // Check that the blogs are ordered by likes
        const likes = await page.locator('text=likes').all()
        await expect(likes[0]).toContainText('likes 2')
        await expect(likes[1]).toContainText('likes 1')
      })
    })
  })
})