module.exports = {
    basicConfiguration: {
        name: "OpenHouse Token",
        symbol: "OHT",
        decimals: 18,
        status: {
            activated: 0,
            deactivated: 1
        },
        totalSupply: 200000000,
        approvedTokens: 100000,
        transferedTokens: 100000,
        commitFromBalance: 20000,
        commitToBalance: 10000,
        offerTokens: 100000,
        // 0.0001 ether.
        offerPrice: "100000000000000",
        // 2.7 hours approximately.
        offerDuration: 10000,
        buyTokens: 10000,
        buyTokensInsufficient: 100,
        adminAccount: 0,
        spenderAccount: 1,
        transferToAccount: 2,
        noTokensAccount: 3,
        newOwnerAccount: 4,
        commitAccount: 5,
        rentAccount: 6
    },
    privateSale: {
        tokensMinCap: 10000,
        tokensMaxCap: 100000,
        // 0.00035 ether.
        tokenPrice:  "350000000000000",
        // 4 weeks.
        duration: 2419200,
        // 36 weeks approx 8 months.
        redeemableAfter: 21772800
    },
    preICOSale: {
        tokensMinCap: 10000,
        tokensMaxCap: 100000,
        // Ether price.
        tokenPrice: 0.0007,
        // 4 weeks.
        duration: 2419200,
        // 28 weeks approx 6 months.
        redeemableAfter: 16934400
    },
    ICOSale: {
        tokensMinCap: 10000,
        tokensMaxCap: 100000,
        // Ether price.
        tokenPrice: 0.0021,
        // 4 weeks.
        duration: 2419200,
        // 24 weeks approx 6 months.
        redeemableAfter: 14515200
    }
}