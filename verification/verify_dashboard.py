from playwright.sync_api import sync_playwright
import os

def run_cuj(page):
    page.goto("http://localhost:3000")
    page.wait_for_timeout(3000)

    # Take screenshot of the dashboard
    page.screenshot(path="verification/screenshots/dashboard.png")

    # Navigate to different pages
    page.get_by_role("button", name="Agents").click()
    page.wait_for_timeout(1000)
    page.screenshot(path="verification/screenshots/agents.png")

    page.get_by_role("button", name="Tasks").click()
    page.wait_for_timeout(1000)
    page.screenshot(path="verification/screenshots/tasks.png")

    page.get_by_role("button", name="Analytics").click()
    page.wait_for_timeout(1000)
    page.screenshot(path="verification/screenshots/analytics.png")

    # Go back to office
    page.get_by_role("button", name="Office").click()
    page.wait_for_timeout(1000)
    page.screenshot(path="verification/screenshots/office_final.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="verification/videos"
        )
        page = context.new_page()
        try:
            run_cuj(page)
        finally:
            context.close()
            browser.close()
