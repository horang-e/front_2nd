import basicViewRender from "./main.view";
import cartItemsViewRender from "./cart.view";
import totalViewRender from "./total.view";
import { initObservers } from "./global";


function main() {
  basicViewRender()
  cartItemsViewRender()
  totalViewRender()
  initObservers('cart', [cartItemsViewRender, totalViewRender])
}

main();
