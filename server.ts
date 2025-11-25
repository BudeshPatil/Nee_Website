import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import mime from 'mime';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import AppServerModule from './src/main.server';


// -----------------------------
// Express Application Factory
// -----------------------------
export function app(): express.Express {
	const server = express();
	const serverDistFolder = dirname(fileURLToPath(import.meta.url));
	const browserDistFolder = resolve(serverDistFolder, '../browser');
	const indexHtml = join(serverDistFolder, 'index.server.html');

	const commonEngine = new CommonEngine();

	// -----------------------------
	// Middleware
	// -----------------------------
	server.use(compression());

	server.use(
		helmet({
			contentSecurityPolicy: false, // Angular manages inline scripts/styles
			crossOriginEmbedderPolicy: false,
		})
	);

	// Add extra security headers (like in .htaccess)
	server.use((_, res, next) => {
		res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
		res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
		next();
	});

	// Serve .txt as text/plain (ads.txt)
	// mime.define({ 'text/plain': ['txt'] });
	// mime.define({ 'text/plain': ['txt'] }, { force: true });

	// -----------------------------
	// Static File Handling & Caching
	// -----------------------------
	server.use(
		express.static(browserDistFolder, {
			maxAge: '1y',
			setHeaders: (res, path) => {
				if (path.endsWith('.html')) {
					res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
				} else if (/\.(js|css|jpg|jpeg|png|gif|svg|woff2?)$/i.test(path)) {
					res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
				}
			},
		})
	);

	// -----------------------------
	// Redirect Routes (from old .htaccess)
	// -----------------------------
	const redirects: Record<string, string> = {
		'/Location': 'https://www.google.com/maps/place/Ghost+Rentals/@25.1221608,55.2232148,17z/data=!3m1!4b1!4m6!3m5!1s0x3e5f6bb7c49961e7:0x4b3661e383f4d582!8m2!3d25.122156!4d55.2257897!16s%2Fg%2F11vynydv15',
		'/Instagram': 'https://www.instagram.com/ghost.rentals/?hl=en',
		'/Review': 'https://www.google.com/maps/place//data=!4m3!3m2!1s0x3e5f6bb7c49961e7:0x4b3661e383f4d582!12e1?source=g.page.m.ia._&laa=nmx-review-solicitation-ia2',
		'/Facebook': 'https://www.facebook.com/Ghostrentalsdubai',
		'/Tiktok': 'https://www.tiktok.com/@ghostrentals',
		'/Linkedin': 'https://ae.linkedin.com/company/ghostrentals',
		'/YouTube': 'https://www.youtube.com/@GhostRentalsDXB',
	};

	Object.entries(redirects).forEach(([path, target]) => {
		server.get(path, (_, res) => res.redirect(301, target));
	});

	// -----------------------------
	// SEO Essentials
	// -----------------------------
	server.get('/sitemap.xml', (_, res) => res.sendFile(join(browserDistFolder, 'sitemap.xml')));
	server.get('/ads.txt', (_, res) => res.sendFile(join(browserDistFolder, 'ads.txt')));
	server.get('/robots.txt', (_, res) => res.sendFile(join(browserDistFolder, 'robots.txt')));

	// -----------------------------
	// Logging (minimal, production-safe)
	// -----------------------------
	server.use((req, res, next) => {
		const start = Date.now();
		res.on('finish', () => {
			const ms = Date.now() - start;
			console.log(`${req.method} ${req.originalUrl} ${res.statusCode} - ${ms}ms`);
		});
		next();
	});

	// -----------------------------
	// Angular SSR Rendering
	// -----------------------------
	server.get('*', (req, res, next) => {
		const { protocol, originalUrl, baseUrl, headers } = req;

		// Store URL info in request for schema service to use
		const requestUrl = `${protocol}://${headers.host}${originalUrl}`;

		commonEngine
			.render({
				bootstrap: AppServerModule,
				documentFilePath: indexHtml,
				url: requestUrl,
				publicPath: browserDistFolder,
				providers: [
					{ provide: APP_BASE_HREF, useValue: baseUrl },
					// Store request info for schema service
					{ provide: 'REQUEST_URL', useValue: requestUrl },
				],
			})
			.then((html) => {
				res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
				res.setHeader('Pragma', 'no-cache');
				res.setHeader('Expires', '0');
				res.setHeader('Surrogate-Control', 'no-store');
				res.status(200).send(html);
			})
			.catch((err) => next(err));
	});

	return server;
}

// -----------------------------
// Run the server
// -----------------------------
function run(): void {
	const port = process.env['PORT'] || 5114;
	// Start up the Node server
	const server = app();
	server.listen(port, () => {
		console.log(`✅ Node SSR server running on http://localhost:${port}`);
	});
	// Graceful error handling
	process.on('uncaughtException', (err) => console.error('❌ Uncaught Exception:', err));
	process.on('unhandledRejection', (err) => console.error('❌ Unhandled Rejection:', err));
}

run();
export default app;
