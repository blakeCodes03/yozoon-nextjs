
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.0.1
 * Query Engine version: 5dbef10bdbfb579e07d35cc85fb1518d357cb99e
 */
Prisma.prismaVersion = {
  client: "6.0.1",
  engine: "5dbef10bdbfb579e07d35cc85fb1518d357cb99e"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  username: 'username',
  email: 'email',
  confirmedEmail: 'confirmedEmail',
  emailVerified: 'emailVerified',
  passwordHash: 'passwordHash',
  role: 'role',
  isVerified: 'isVerified',
  verificationToken: 'verificationToken',
  verificationTokenExpiresAt: 'verificationTokenExpiresAt',
  resetToken: 'resetToken',
  resetTokenExpiresAt: 'resetTokenExpiresAt',
  pictureUrl: 'pictureUrl',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  referralCode: 'referralCode',
  referrerId: 'referrerId'
};

exports.Prisma.CoinScalarFieldEnum = {
  id: 'id',
  name: 'name',
  ticker: 'ticker',
  description: 'description',
  pictureUrl: 'pictureUrl',
  telegramLink: 'telegramLink',
  discordLink: 'discordLink',
  socialLinks: 'socialLinks',
  totalSupply: 'totalSupply',
  airdropAmount: 'airdropAmount',
  blockchain: 'blockchain',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  creatorId: 'creatorId',
  reputationScore: 'reputationScore',
  status: 'status',
  marketCap: 'marketCap'
};

exports.Prisma.MilestoneScalarFieldEnum = {
  id: 'id',
  date: 'date',
  description: 'description',
  coinId: 'coinId'
};

exports.Prisma.HashtagScalarFieldEnum = {
  id: 'id',
  tag: 'tag',
  usageCount: 'usageCount'
};

exports.Prisma.BondingCurveScalarFieldEnum = {
  id: 'id',
  coinId: 'coinId',
  curveDetail: 'curveDetail',
  feeStructureId: 'feeStructureId',
  isCompleted: 'isCompleted',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.FeeStructureScalarFieldEnum = {
  id: 'id',
  tradeFee: 'tradeFee',
  memecoinFee: 'memecoinFee',
  feeDescription: 'feeDescription'
};

exports.Prisma.VoteScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  coinId: 'coinId',
  proposalId: 'proposalId',
  value: 'value',
  createdAt: 'createdAt'
};

exports.Prisma.ChatMessageScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  coinId: 'coinId',
  message: 'message',
  createdAt: 'createdAt',
  media: 'media',
  upvotes: 'upvotes',
  downvotes: 'downvotes'
};

exports.Prisma.CommentsScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  coinId: 'coinId',
  message: 'message',
  createdAt: 'createdAt',
  upvotes: 'upvotes',
  downvotes: 'downvotes'
};

exports.Prisma.ReputationScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  score: 'score'
};

exports.Prisma.WalletAddressScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  address: 'address',
  network: 'network',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SocialAccountScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  platform: 'platform',
  handle: 'handle',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TokenHoldingScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  coinId: 'coinId',
  amount: 'amount',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PriceHistoryScalarFieldEnum = {
  id: 'id',
  coinId: 'coinId',
  price: 'price',
  timestamp: 'timestamp'
};

exports.Prisma.AccountScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  type: 'type',
  provider: 'provider',
  providerAccountId: 'providerAccountId',
  refresh_token: 'refresh_token',
  access_token: 'access_token',
  expires_at: 'expires_at',
  token_type: 'token_type',
  scope: 'scope',
  id_token: 'id_token',
  session_state: 'session_state'
};

exports.Prisma.SessionScalarFieldEnum = {
  id: 'id',
  sessionToken: 'sessionToken',
  userId: 'userId',
  expires: 'expires'
};

exports.Prisma.VerificationTokenScalarFieldEnum = {
  identifier: 'identifier',
  token: 'token',
  expires: 'expires'
};

exports.Prisma.TransactionScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  coinId: 'coinId',
  type: 'type',
  amount: 'amount',
  price: 'price',
  total: 'total',
  createdAt: 'createdAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};
exports.Blockchain = exports.$Enums.Blockchain = {
  sol: 'sol',
  bnb: 'bnb',
  eth: 'eth',
  avax: 'avax',
  blast: 'blast',
  optimism: 'optimism',
  opbnb: 'opbnb',
  aptos: 'aptos',
  hbar: 'hbar',
  linear: 'linear'
};

exports.CoinStatus = exports.$Enums.CoinStatus = {
  voting: 'voting',
  bondingCurve: 'bondingCurve',
  manualLaunch: 'manualLaunch',
  completed: 'completed'
};

exports.Prisma.ModelName = {
  User: 'User',
  Coin: 'Coin',
  Milestone: 'Milestone',
  Hashtag: 'Hashtag',
  BondingCurve: 'BondingCurve',
  FeeStructure: 'FeeStructure',
  Vote: 'Vote',
  ChatMessage: 'ChatMessage',
  Comments: 'Comments',
  Reputation: 'Reputation',
  WalletAddress: 'WalletAddress',
  SocialAccount: 'SocialAccount',
  TokenHolding: 'TokenHolding',
  PriceHistory: 'PriceHistory',
  Account: 'Account',
  Session: 'Session',
  VerificationToken: 'VerificationToken',
  Transaction: 'Transaction'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
