from playwright.sync_api import sync_playwright, Page, expect
import time

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    # 1. Navigate to the application
    page.goto("http://localhost:5173/")

    # 2. Wait for the page to load
    time.sleep(5)

    # 3. Print the page content for debugging
    print(page.content())

    # 4. Take a screenshot
    page.screenshot(path="jules-scratch/verification/verification.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
