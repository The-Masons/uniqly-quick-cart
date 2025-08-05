import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import QuickCart from './components/quick-cart.js';

createRoot(document.getElementById('quick-cart-app'))
	.render(
		<StrictMode>
			<QuickCart item={parseInt(window.location.href.split('/').pop()) || 0} />
		</StrictMode>
	);
