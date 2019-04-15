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
        offerPrice: 100000000000000,
        // 2.7 hours approximately.
        offerDuration: 10000,
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
        tokenPrice:  350000000000000,
        totalSupply: 20000000,
        // 1 month.
        duration: 2592000,
        // 4 months.
        redeemableAfter: 10368000
    },
    preICOSale: {
        tokensMinCap: 10000,
        tokensMaxCap: 100000,
        // 0.0007 ether.
        tokenPrice: 700000000000000,
        totalSupply: 20000000,
        // 1 month.
        duration: 2592000,
        // 4 months.
        redeemableAfter: 10368000
    },
    ICOSale: {
        tokensMinCap: 10000,
        tokensMaxCap: 100000,
        // 0.0021 ether.
        tokenPrice: 2100000000000000,
        totalSupply: 100000000,
        // 1 month.
        duration: 2592000,
        // Immediately.
        redeemableAfter: 0
    }
}