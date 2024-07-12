import basicViewRender from "./mainView";
import cartItemsViewRender from "./cartView";
import totalViewRender from "./totalView";
import { initObservers } from "./global";


function main() {
  basicViewRender()
  cartItemsViewRender()
  totalViewRender()
  initObservers('cart', [cartItemsViewRender, totalViewRender])
}

main();
