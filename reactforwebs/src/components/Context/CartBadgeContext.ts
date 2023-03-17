import { createContext, useState } from 'react';

export interface ICartBadgeContext {
    cartQuantity: number,
    init: (cartRowQties: number[]) => void,
    update: (changeInQuantity: number) => void,
}

const defaultCartBadgeContext: ICartBadgeContext = {
    cartQuantity: 0,
    init: (): void => {},
    update: (): void => {},
}

export const CartBadgeContextState = () :ICartBadgeContext => {
    const [badgeContext, setBadgeContext] = useState<ICartBadgeContext>(defaultCartBadgeContext);

    badgeContext.init = (cartRowQties: number[]): void => {
        badgeContext.cartQuantity = 0;
        cartRowQties.forEach((rowQty: number) => {
            badgeContext.cartQuantity += rowQty;
        });
        setBadgeContext({ ...badgeContext});
    }

    badgeContext.update = (changeInQuantity: number): void => {
        badgeContext.cartQuantity += changeInQuantity;
        setBadgeContext({ ...badgeContext });
    }

    return badgeContext;
}

const BadgeContext = createContext<ICartBadgeContext>(defaultCartBadgeContext);
export default BadgeContext;