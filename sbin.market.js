/** @param {import("..").NS } ns */
/******************************/
/*      modules/autostocks.js */
/******************************/

const bitnode8 = false; // can you short stocks?
const narrow_display = false;

class Stock {
	constructor(symbol) {
		this.symbol = symbol;
		this.maxShares = 0;
		this.askPrice;
		this.bidPrice;
		this.forecast = .5;
		this.position = {
			long: 0,
			longprice: 0,
			short: 0,
			shortprice: 0
		}
	}

	update(ns) {
		this.maxShares = ns.stock.getMaxShares(this.symbol);
		this.askPrice = ns.stock.getAskPrice(this.symbol);
		this.bidPrice = ns.stock.getBidPrice(this.symbol);

		this.position = {
			long: ns.stock.getPosition(this.symbol)[0],
			longprice : ns.stock.getPosition(this.symbol)[1],
			short: ns.stock.getPosition(this.symbol)[2],
			shortprice: ns.stock.getPosition(this.symbol)[3],
			
		}

		this.forecast = ns.stock.getForecast(this.symbol)

		if (bitnode8) { this.deviation = Math.abs(this.forecast - .5) } else { this.deviation = this.forecast }

	}

	coverShort(ns) {
		return ns.stock.sellShort(this.symbol, 1000000000000000)
		// this.cancelOrders(ns)
	}

	sellLong(ns) {
		return ns.stock.sell(this.symbol, 1000000000000000)
		// this.cancelOrders(ns)
	}

	buyLong(ns) {
		this.askPrice = ns.stock.getAskPrice(this.symbol);
		let shares = (ns.getServerMoneyAvailable("home") - 100000) / this.askPrice;
		shares = Math.min(this.maxShares - this.position.long, shares);
		if (shares * this.bidPrice > 2000000) {
			return ns.stock.buy(this.symbol, Math.floor(shares));
		}

		// ns.stock.placeOrder(this.symbol, shares, price * .9, "Stop Sell Order", "L");
		// ns.stock.placeOrder(this.symbol, shares, price * 2, "Limit Sell Order", "L");

	}

	buyShort(ns) {
		this.bidPrice = ns.stock.getBidPrice(this.symbol);
		let shares = (ns.getServerMoneyAvailable("home") - 100000) / this.bidPrice;
		shares = Math.min(this.maxShares - this.position.short, shares);
		if ((shares * this.bidPrice) > 2000000 && bitnode8) {
			return ns.stock.short(this.symbol, Math.floor(shares));
		}

		// ns.stock.placeOrder(this.symbol, shares, price * 1.05, "Stop Sell Order", "S");
		// ns.stock.placeOrder(this.symbol, shares, price * .7, "Limit Sell Order", "S");

	}

}


function scan(ns) {
	let tickers = ns.stock.getSymbols();
	let stock_list = [];
	tickers.forEach(s => stock_list.push(new Stock(s)));
	return stock_list;
}

function sell_everything(ns) {
	let stox = scan(ns);
	for (let stock of stox) {
		stock.update(ns);

		if (stock.position.long > 0) {
			stock.sellLong(ns);
		}

		if (stock.position.short > 0) {
			stock.coverShort(ns);
		}
		stock.update(ns);

		if (stock.position.long > 0 || stock.position.short > 0) {
			ns.tprint("WARNING: Still have some live stocks.")
		}
	}
}

export async function main(ns) {
	/*
	Automatically manages the stock market. Requires Stock Market API TIX upgrade.
	*/
	if (ns.args[0] == "SELLOFF") {
		sell_everything(ns);
		ns.exit();
	}

	ns.disableLog("ALL");
	ns.enableLog("stock.buy");
	ns.enableLog("stock.sell");
	//ns.atExit(sell_everything(ns));
	ns.clearLog();
	ns.print("Loading...")
	const stocks = scan(ns);
	let loopcount = 0;
	while (true) {
		loopcount++;
		if (loopcount % 234 == 0) { sell_everything(ns) } // rebalancing hack
		for (let stock of stocks) {
			stock.update(ns);

			// Sell on the wrong side of forecasts
			if (stock.position.long > 0 && stock.forecast < .5) {
				stock.sellLong(ns);
			}
			if (stock.position.short > 0 && stock.forecast > .5) {
				stock.coverShort(ns);
			}
		}

		// sort stocks by forecast value, deviation from .5
		stocks.sort((a, b) => b.deviation - a.deviation)

		for (let stock of stocks) {
			(stock.forecast) > .535 ? stock.buyLong(ns) :
				(stock.forecast) < .465 ? stock.buyShort(ns) : null
		}

		await ns.sleep(6000);

		let net_worth = ns.getServerMoneyAvailable("home");
		ns.clearLog()

		if (narrow_display) {
			ns.print("-".padStart(10, "-"))
			ns.print(
				"TICK".padStart(5),
				"%".padStart(5)
			)
			ns.print("-".padStart(10, "-"))
			for (let stock of stocks) {
				stock.update(ns);

				net_worth += (stock.position.long * stock.bidPrice)
				net_worth += (stock.position.short * stock.position.shortprice)
				net_worth += ((stock.position.short * stock.askPrice) - (stock.position.shortprice * stock.position.short))*-1

				ns.print(
					stock.symbol.padStart(5),
					ns.nFormat((stock.position.long - stock.position.short) / stock.maxShares, '0%').padStart(5));
			}

			ns.print(ns.nFormat(net_worth, '$0.0a').padStart(10));

		} else {

			ns.print("-".padStart(40, "-"));
			ns.print(
				"TICKER".padStart(10),
				"PRICE".padStart(10),
				"FORECAST".padStart(10),
				"POSITION".padStart(10),
			)
			ns.print("-".padStart(40, "-"));


			for (let stock of stocks) {
				stock.update(ns);
				net_worth += (stock.position.long * stock.bidPrice)
				net_worth += (stock.position.short * stock.position.shortprice)
				net_worth += ((stock.position.short * stock.askPrice) - (stock.position.shortprice * stock.position.short))*-1

				ns.print(
					stock.symbol.padStart(10),
					ns.nFormat(stock.askPrice, '0.00a').padStart(10),
					ns.nFormat(stock.forecast, '.000').padStart(10),
					ns.nFormat(stock.position.long - stock.position.short, '0a').padStart(10));
			}

			ns.print("-".padStart(12, "-"), ("NET WORTH: " + ns.nFormat(net_worth, '$ 0.00a')).padStart(16), "-".padEnd(12, "-"));
		}
	}

}

// const stoxauto = main(ns)
// export default stoxauto