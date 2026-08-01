declare module "playwright" {
    export interface Locator {
        click(options?: { timeout?: number }): Promise<void>;
        first(): Locator;
        count(): Promise<number>;
    }

    export interface Cookie {
        name: string;
        value: string;
        domain: string;
        path: string;
        httpOnly: boolean;
        secure: boolean;
    }

    export interface Page {
        goto(
            url: string,
            options?: { waitUntil?: string; timeout?: number }
        ): Promise<{ status(): number } | null>;
        getByRole(role: string, options?: { name?: string | RegExp }): Locator;
        locator(selector: string): Locator;
        waitForTimeout(timeout: number): Promise<void>;
        url(): string;
    }

    export interface BrowserContext {
        pages(): Page[];
        newPage(): Promise<Page>;
        cookies(urls?: string | string[]): Promise<Cookie[]>;
        storageState(options?: { path?: string }): Promise<unknown>;
        close(): Promise<void>;
    }

    export const chromium: {
        launchPersistentContext(
            userDataDir: string,
            options?: Record<string, unknown>
        ): Promise<BrowserContext>;
    };
}
