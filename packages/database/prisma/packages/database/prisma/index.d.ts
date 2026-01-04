
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Transaction
 * 
 */
export type Transaction = $Result.DefaultSelection<Prisma.$TransactionPayload>
/**
 * Model Resume
 * 
 */
export type Resume = $Result.DefaultSelection<Prisma.$ResumePayload>
/**
 * Model Campaign
 * 
 */
export type Campaign = $Result.DefaultSelection<Prisma.$CampaignPayload>
/**
 * Model CampaignLinkedin
 * 
 */
export type CampaignLinkedin = $Result.DefaultSelection<Prisma.$CampaignLinkedinPayload>
/**
 * Model CampaignInfojobs
 * 
 */
export type CampaignInfojobs = $Result.DefaultSelection<Prisma.$CampaignInfojobsPayload>
/**
 * Model JobApplication
 * 
 */
export type JobApplication = $Result.DefaultSelection<Prisma.$JobApplicationPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const UserRole: {
  admin: 'admin',
  user: 'user'
};

export type UserRole = (typeof UserRole)[keyof typeof UserRole]


export const AppStatus: {
  pending: 'pending',
  applied: 'applied',
  failed: 'failed',
  skipped: 'skipped'
};

export type AppStatus = (typeof AppStatus)[keyof typeof AppStatus]


export const Platform: {
  linkedin: 'linkedin',
  infojobs: 'infojobs'
};

export type Platform = (typeof Platform)[keyof typeof Platform]


export const BrazilState: {
  acre: 'acre',
  alagoas: 'alagoas',
  amapa: 'amapa',
  amazonas: 'amazonas',
  bahia: 'bahia',
  ceara: 'ceara',
  distrito_federal: 'distrito_federal',
  espirito_santo: 'espirito_santo',
  goias: 'goias',
  maranhao: 'maranhao',
  mato_grosso: 'mato_grosso',
  mato_grosso_do_sul: 'mato_grosso_do_sul',
  minas_gerais: 'minas_gerais',
  para: 'para',
  paraiba: 'paraiba',
  parana: 'parana',
  pernambuco: 'pernambuco',
  piaui: 'piaui',
  rio_de_janeiro: 'rio_de_janeiro',
  rio_grande_do_norte: 'rio_grande_do_norte',
  rio_grande_do_sul: 'rio_grande_do_sul',
  rondonia: 'rondonia',
  roraima: 'roraima',
  santa_catarina: 'santa_catarina',
  sao_paulo: 'sao_paulo',
  sergipe: 'sergipe',
  tocantins: 'tocantins'
};

export type BrazilState = (typeof BrazilState)[keyof typeof BrazilState]


export const LinkedinSort: {
  recent: 'recent',
  relevant: 'relevant'
};

export type LinkedinSort = (typeof LinkedinSort)[keyof typeof LinkedinSort]


export const LinkedinDate: {
  any: 'any',
  past_month: 'past_month',
  past_week: 'past_week',
  past_24h: 'past_24h'
};

export type LinkedinDate = (typeof LinkedinDate)[keyof typeof LinkedinDate]


export const LinkedinExp: {
  internship: 'internship',
  entry: 'entry',
  associate: 'associate',
  mid_senior: 'mid_senior',
  director: 'director',
  executive: 'executive'
};

export type LinkedinExp = (typeof LinkedinExp)[keyof typeof LinkedinExp]


export const LinkedinJobType: {
  full_time: 'full_time',
  part_time: 'part_time',
  contract: 'contract',
  temporary: 'temporary',
  volunteer: 'volunteer',
  internship: 'internship',
  other: 'other'
};

export type LinkedinJobType = (typeof LinkedinJobType)[keyof typeof LinkedinJobType]


export const LinkedinRemote: {
  remote: 'remote',
  hybrid: 'hybrid',
  on_site: 'on_site'
};

export type LinkedinRemote = (typeof LinkedinRemote)[keyof typeof LinkedinRemote]


export const IjWorkModel: {
  presencial: 'presencial',
  home_office: 'home_office',
  hibrido: 'hibrido'
};

export type IjWorkModel = (typeof IjWorkModel)[keyof typeof IjWorkModel]


export const IjRadius: {
  km_5: 'km_5',
  km_10: 'km_10',
  km_25: 'km_25',
  km_50: 'km_50',
  km_75: 'km_75',
  km_100: 'km_100'
};

export type IjRadius = (typeof IjRadius)[keyof typeof IjRadius]


export const IjSalary: {
  brl_1000: 'brl_1000',
  brl_2000: 'brl_2000',
  brl_3000: 'brl_3000',
  brl_4000: 'brl_4000',
  brl_5000: 'brl_5000',
  brl_6000: 'brl_6000',
  brl_7000: 'brl_7000',
  brl_8000: 'brl_8000',
  brl_9000: 'brl_9000',
  brl_10000: 'brl_10000'
};

export type IjSalary = (typeof IjSalary)[keyof typeof IjSalary]


export const IjDatePosted: {
  hoje: 'hoje',
  ultimos_3_dias: 'ultimos_3_dias',
  ultima_semana: 'ultima_semana',
  ultimos_15_dias: 'ultimos_15_dias',
  ultimo_mes: 'ultimo_mes'
};

export type IjDatePosted = (typeof IjDatePosted)[keyof typeof IjDatePosted]


export const IjJobArea: {
  administracao: 'administracao',
  agricultura_pecuaria_veterinaria: 'agricultura_pecuaria_veterinaria',
  alimentacao_gastronomia: 'alimentacao_gastronomia',
  arquitetura_decoracao_design: 'arquitetura_decoracao_design',
  artes: 'artes',
  auditoria: 'auditoria',
  ciencias_pesquisa: 'ciencias_pesquisa',
  comercial_vendas: 'comercial_vendas',
  comercio_exterior: 'comercio_exterior',
  compras: 'compras',
  comunicacao_tv_cinema: 'comunicacao_tv_cinema',
  construcao_manutencao: 'construcao_manutencao',
  contabil_financas_economia: 'contabil_financas_economia',
  cultura_lazer_entretenimento: 'cultura_lazer_entretenimento',
  educacao_ensino_idiomas: 'educacao_ensino_idiomas',
  engenharia: 'engenharia',
  estetica: 'estetica',
  hotelaria_turismo: 'hotelaria_turismo',
  industrial_producao_fabrica: 'industrial_producao_fabrica',
  informatica_ti_telecomunicacoes: 'informatica_ti_telecomunicacoes',
  juridica: 'juridica',
  logistica: 'logistica',
  marketing: 'marketing',
  meio_ambiente_ecologia: 'meio_ambiente_ecologia',
  moda: 'moda',
  qualidade: 'qualidade',
  quimica_petroquimica: 'quimica_petroquimica',
  recursos_humanos: 'recursos_humanos',
  saude: 'saude',
  seguranca: 'seguranca',
  servico_social_comunitario: 'servico_social_comunitario',
  servicos_gerais: 'servicos_gerais',
  telemarketing: 'telemarketing',
  transportes: 'transportes'
};

export type IjJobArea = (typeof IjJobArea)[keyof typeof IjJobArea]


export const IjContract: {
  clt: 'clt',
  autonomo: 'autonomo',
  pj: 'pj',
  cooperado: 'cooperado',
  jovem_aprendiz: 'jovem_aprendiz',
  estagio: 'estagio',
  temporario: 'temporario',
  trainee: 'trainee',
  outros: 'outros'
};

export type IjContract = (typeof IjContract)[keyof typeof IjContract]


export const IjSchedule: {
  periodo_integral: 'periodo_integral',
  parcial_manha: 'parcial_manha',
  parcial_tarde: 'parcial_tarde',
  parcial_noite: 'parcial_noite',
  noturno: 'noturno'
};

export type IjSchedule = (typeof IjSchedule)[keyof typeof IjSchedule]


export const IjSeniority: {
  estagiario: 'estagiario',
  operacional: 'operacional',
  auxiliar: 'auxiliar',
  assistente: 'assistente',
  trainee: 'trainee',
  tecnico: 'tecnico',
  analista: 'analista',
  encarregado: 'encarregado',
  supervisor: 'supervisor',
  consultor: 'consultor',
  especialista: 'especialista',
  coordenador: 'coordenador',
  gerente: 'gerente',
  diretor: 'diretor'
};

export type IjSeniority = (typeof IjSeniority)[keyof typeof IjSeniority]


export const IjPcd: {
  auditiva: 'auditiva',
  fisica: 'fisica',
  visual: 'visual',
  mental: 'mental',
  reabilitados: 'reabilitados',
  psicossocial: 'psicossocial',
  fala: 'fala',
  intelectual: 'intelectual',
  tea: 'tea'
};

export type IjPcd = (typeof IjPcd)[keyof typeof IjPcd]


export const TransactionType: {
  purchase: 'purchase',
  usage: 'usage',
  bonus: 'bonus',
  refund: 'refund'
};

export type TransactionType = (typeof TransactionType)[keyof typeof TransactionType]

}

export type UserRole = $Enums.UserRole

export const UserRole: typeof $Enums.UserRole

export type AppStatus = $Enums.AppStatus

export const AppStatus: typeof $Enums.AppStatus

export type Platform = $Enums.Platform

export const Platform: typeof $Enums.Platform

export type BrazilState = $Enums.BrazilState

export const BrazilState: typeof $Enums.BrazilState

export type LinkedinSort = $Enums.LinkedinSort

export const LinkedinSort: typeof $Enums.LinkedinSort

export type LinkedinDate = $Enums.LinkedinDate

export const LinkedinDate: typeof $Enums.LinkedinDate

export type LinkedinExp = $Enums.LinkedinExp

export const LinkedinExp: typeof $Enums.LinkedinExp

export type LinkedinJobType = $Enums.LinkedinJobType

export const LinkedinJobType: typeof $Enums.LinkedinJobType

export type LinkedinRemote = $Enums.LinkedinRemote

export const LinkedinRemote: typeof $Enums.LinkedinRemote

export type IjWorkModel = $Enums.IjWorkModel

export const IjWorkModel: typeof $Enums.IjWorkModel

export type IjRadius = $Enums.IjRadius

export const IjRadius: typeof $Enums.IjRadius

export type IjSalary = $Enums.IjSalary

export const IjSalary: typeof $Enums.IjSalary

export type IjDatePosted = $Enums.IjDatePosted

export const IjDatePosted: typeof $Enums.IjDatePosted

export type IjJobArea = $Enums.IjJobArea

export const IjJobArea: typeof $Enums.IjJobArea

export type IjContract = $Enums.IjContract

export const IjContract: typeof $Enums.IjContract

export type IjSchedule = $Enums.IjSchedule

export const IjSchedule: typeof $Enums.IjSchedule

export type IjSeniority = $Enums.IjSeniority

export const IjSeniority: typeof $Enums.IjSeniority

export type IjPcd = $Enums.IjPcd

export const IjPcd: typeof $Enums.IjPcd

export type TransactionType = $Enums.TransactionType

export const TransactionType: typeof $Enums.TransactionType

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.transaction`: Exposes CRUD operations for the **Transaction** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Transactions
    * const transactions = await prisma.transaction.findMany()
    * ```
    */
  get transaction(): Prisma.TransactionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.resume`: Exposes CRUD operations for the **Resume** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Resumes
    * const resumes = await prisma.resume.findMany()
    * ```
    */
  get resume(): Prisma.ResumeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.campaign`: Exposes CRUD operations for the **Campaign** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Campaigns
    * const campaigns = await prisma.campaign.findMany()
    * ```
    */
  get campaign(): Prisma.CampaignDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.campaignLinkedin`: Exposes CRUD operations for the **CampaignLinkedin** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CampaignLinkedins
    * const campaignLinkedins = await prisma.campaignLinkedin.findMany()
    * ```
    */
  get campaignLinkedin(): Prisma.CampaignLinkedinDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.campaignInfojobs`: Exposes CRUD operations for the **CampaignInfojobs** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CampaignInfojobs
    * const campaignInfojobs = await prisma.campaignInfojobs.findMany()
    * ```
    */
  get campaignInfojobs(): Prisma.CampaignInfojobsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.jobApplication`: Exposes CRUD operations for the **JobApplication** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more JobApplications
    * const jobApplications = await prisma.jobApplication.findMany()
    * ```
    */
  get jobApplication(): Prisma.JobApplicationDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.2.0
   * Query Engine version: 0c8ef2ce45c83248ab3df073180d5eda9e8be7a3
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Transaction: 'Transaction',
    Resume: 'Resume',
    Campaign: 'Campaign',
    CampaignLinkedin: 'CampaignLinkedin',
    CampaignInfojobs: 'CampaignInfojobs',
    JobApplication: 'JobApplication'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "transaction" | "resume" | "campaign" | "campaignLinkedin" | "campaignInfojobs" | "jobApplication"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Transaction: {
        payload: Prisma.$TransactionPayload<ExtArgs>
        fields: Prisma.TransactionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TransactionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TransactionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          findFirst: {
            args: Prisma.TransactionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TransactionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          findMany: {
            args: Prisma.TransactionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>[]
          }
          create: {
            args: Prisma.TransactionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          createMany: {
            args: Prisma.TransactionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TransactionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>[]
          }
          delete: {
            args: Prisma.TransactionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          update: {
            args: Prisma.TransactionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          deleteMany: {
            args: Prisma.TransactionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TransactionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TransactionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>[]
          }
          upsert: {
            args: Prisma.TransactionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          aggregate: {
            args: Prisma.TransactionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTransaction>
          }
          groupBy: {
            args: Prisma.TransactionGroupByArgs<ExtArgs>
            result: $Utils.Optional<TransactionGroupByOutputType>[]
          }
          count: {
            args: Prisma.TransactionCountArgs<ExtArgs>
            result: $Utils.Optional<TransactionCountAggregateOutputType> | number
          }
        }
      }
      Resume: {
        payload: Prisma.$ResumePayload<ExtArgs>
        fields: Prisma.ResumeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ResumeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ResumeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumePayload>
          }
          findFirst: {
            args: Prisma.ResumeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ResumeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumePayload>
          }
          findMany: {
            args: Prisma.ResumeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumePayload>[]
          }
          create: {
            args: Prisma.ResumeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumePayload>
          }
          createMany: {
            args: Prisma.ResumeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ResumeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumePayload>[]
          }
          delete: {
            args: Prisma.ResumeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumePayload>
          }
          update: {
            args: Prisma.ResumeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumePayload>
          }
          deleteMany: {
            args: Prisma.ResumeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ResumeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ResumeUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumePayload>[]
          }
          upsert: {
            args: Prisma.ResumeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumePayload>
          }
          aggregate: {
            args: Prisma.ResumeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateResume>
          }
          groupBy: {
            args: Prisma.ResumeGroupByArgs<ExtArgs>
            result: $Utils.Optional<ResumeGroupByOutputType>[]
          }
          count: {
            args: Prisma.ResumeCountArgs<ExtArgs>
            result: $Utils.Optional<ResumeCountAggregateOutputType> | number
          }
        }
      }
      Campaign: {
        payload: Prisma.$CampaignPayload<ExtArgs>
        fields: Prisma.CampaignFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CampaignFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CampaignFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignPayload>
          }
          findFirst: {
            args: Prisma.CampaignFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CampaignFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignPayload>
          }
          findMany: {
            args: Prisma.CampaignFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignPayload>[]
          }
          create: {
            args: Prisma.CampaignCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignPayload>
          }
          createMany: {
            args: Prisma.CampaignCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CampaignCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignPayload>[]
          }
          delete: {
            args: Prisma.CampaignDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignPayload>
          }
          update: {
            args: Prisma.CampaignUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignPayload>
          }
          deleteMany: {
            args: Prisma.CampaignDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CampaignUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CampaignUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignPayload>[]
          }
          upsert: {
            args: Prisma.CampaignUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignPayload>
          }
          aggregate: {
            args: Prisma.CampaignAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCampaign>
          }
          groupBy: {
            args: Prisma.CampaignGroupByArgs<ExtArgs>
            result: $Utils.Optional<CampaignGroupByOutputType>[]
          }
          count: {
            args: Prisma.CampaignCountArgs<ExtArgs>
            result: $Utils.Optional<CampaignCountAggregateOutputType> | number
          }
        }
      }
      CampaignLinkedin: {
        payload: Prisma.$CampaignLinkedinPayload<ExtArgs>
        fields: Prisma.CampaignLinkedinFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CampaignLinkedinFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignLinkedinPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CampaignLinkedinFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignLinkedinPayload>
          }
          findFirst: {
            args: Prisma.CampaignLinkedinFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignLinkedinPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CampaignLinkedinFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignLinkedinPayload>
          }
          findMany: {
            args: Prisma.CampaignLinkedinFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignLinkedinPayload>[]
          }
          create: {
            args: Prisma.CampaignLinkedinCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignLinkedinPayload>
          }
          createMany: {
            args: Prisma.CampaignLinkedinCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CampaignLinkedinCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignLinkedinPayload>[]
          }
          delete: {
            args: Prisma.CampaignLinkedinDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignLinkedinPayload>
          }
          update: {
            args: Prisma.CampaignLinkedinUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignLinkedinPayload>
          }
          deleteMany: {
            args: Prisma.CampaignLinkedinDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CampaignLinkedinUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CampaignLinkedinUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignLinkedinPayload>[]
          }
          upsert: {
            args: Prisma.CampaignLinkedinUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignLinkedinPayload>
          }
          aggregate: {
            args: Prisma.CampaignLinkedinAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCampaignLinkedin>
          }
          groupBy: {
            args: Prisma.CampaignLinkedinGroupByArgs<ExtArgs>
            result: $Utils.Optional<CampaignLinkedinGroupByOutputType>[]
          }
          count: {
            args: Prisma.CampaignLinkedinCountArgs<ExtArgs>
            result: $Utils.Optional<CampaignLinkedinCountAggregateOutputType> | number
          }
        }
      }
      CampaignInfojobs: {
        payload: Prisma.$CampaignInfojobsPayload<ExtArgs>
        fields: Prisma.CampaignInfojobsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CampaignInfojobsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignInfojobsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CampaignInfojobsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignInfojobsPayload>
          }
          findFirst: {
            args: Prisma.CampaignInfojobsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignInfojobsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CampaignInfojobsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignInfojobsPayload>
          }
          findMany: {
            args: Prisma.CampaignInfojobsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignInfojobsPayload>[]
          }
          create: {
            args: Prisma.CampaignInfojobsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignInfojobsPayload>
          }
          createMany: {
            args: Prisma.CampaignInfojobsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CampaignInfojobsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignInfojobsPayload>[]
          }
          delete: {
            args: Prisma.CampaignInfojobsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignInfojobsPayload>
          }
          update: {
            args: Prisma.CampaignInfojobsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignInfojobsPayload>
          }
          deleteMany: {
            args: Prisma.CampaignInfojobsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CampaignInfojobsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CampaignInfojobsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignInfojobsPayload>[]
          }
          upsert: {
            args: Prisma.CampaignInfojobsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CampaignInfojobsPayload>
          }
          aggregate: {
            args: Prisma.CampaignInfojobsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCampaignInfojobs>
          }
          groupBy: {
            args: Prisma.CampaignInfojobsGroupByArgs<ExtArgs>
            result: $Utils.Optional<CampaignInfojobsGroupByOutputType>[]
          }
          count: {
            args: Prisma.CampaignInfojobsCountArgs<ExtArgs>
            result: $Utils.Optional<CampaignInfojobsCountAggregateOutputType> | number
          }
        }
      }
      JobApplication: {
        payload: Prisma.$JobApplicationPayload<ExtArgs>
        fields: Prisma.JobApplicationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.JobApplicationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobApplicationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.JobApplicationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobApplicationPayload>
          }
          findFirst: {
            args: Prisma.JobApplicationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobApplicationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.JobApplicationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobApplicationPayload>
          }
          findMany: {
            args: Prisma.JobApplicationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobApplicationPayload>[]
          }
          create: {
            args: Prisma.JobApplicationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobApplicationPayload>
          }
          createMany: {
            args: Prisma.JobApplicationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.JobApplicationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobApplicationPayload>[]
          }
          delete: {
            args: Prisma.JobApplicationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobApplicationPayload>
          }
          update: {
            args: Prisma.JobApplicationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobApplicationPayload>
          }
          deleteMany: {
            args: Prisma.JobApplicationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.JobApplicationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.JobApplicationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobApplicationPayload>[]
          }
          upsert: {
            args: Prisma.JobApplicationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobApplicationPayload>
          }
          aggregate: {
            args: Prisma.JobApplicationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateJobApplication>
          }
          groupBy: {
            args: Prisma.JobApplicationGroupByArgs<ExtArgs>
            result: $Utils.Optional<JobApplicationGroupByOutputType>[]
          }
          count: {
            args: Prisma.JobApplicationCountArgs<ExtArgs>
            result: $Utils.Optional<JobApplicationCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    transaction?: TransactionOmit
    resume?: ResumeOmit
    campaign?: CampaignOmit
    campaignLinkedin?: CampaignLinkedinOmit
    campaignInfojobs?: CampaignInfojobsOmit
    jobApplication?: JobApplicationOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    resumes: number
    campaigns: number
    jobApplications: number
    transaction: number
    stripeTransaction: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    resumes?: boolean | UserCountOutputTypeCountResumesArgs
    campaigns?: boolean | UserCountOutputTypeCountCampaignsArgs
    jobApplications?: boolean | UserCountOutputTypeCountJobApplicationsArgs
    transaction?: boolean | UserCountOutputTypeCountTransactionArgs
    stripeTransaction?: boolean | UserCountOutputTypeCountStripeTransactionArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountResumesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ResumeWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountCampaignsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CampaignWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountJobApplicationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: JobApplicationWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountTransactionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TransactionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountStripeTransactionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TransactionWhereInput
  }


  /**
   * Count Type ResumeCountOutputType
   */

  export type ResumeCountOutputType = {
    campaigns: number
  }

  export type ResumeCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    campaigns?: boolean | ResumeCountOutputTypeCountCampaignsArgs
  }

  // Custom InputTypes
  /**
   * ResumeCountOutputType without action
   */
  export type ResumeCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResumeCountOutputType
     */
    select?: ResumeCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ResumeCountOutputType without action
   */
  export type ResumeCountOutputTypeCountCampaignsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CampaignWhereInput
  }


  /**
   * Count Type CampaignCountOutputType
   */

  export type CampaignCountOutputType = {
    jobApplications: number
  }

  export type CampaignCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    jobApplications?: boolean | CampaignCountOutputTypeCountJobApplicationsArgs
  }

  // Custom InputTypes
  /**
   * CampaignCountOutputType without action
   */
  export type CampaignCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CampaignCountOutputType
     */
    select?: CampaignCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CampaignCountOutputType without action
   */
  export type CampaignCountOutputTypeCountJobApplicationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: JobApplicationWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    credits: number | null
  }

  export type UserSumAggregateOutputType = {
    credits: number | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    password: string | null
    role: $Enums.UserRole | null
    stripeCustomerId: string | null
    credits: number | null
    planTier: string | null
    createdAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    password: string | null
    role: $Enums.UserRole | null
    stripeCustomerId: string | null
    credits: number | null
    planTier: string | null
    createdAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    password: number
    role: number
    stripeCustomerId: number
    credits: number
    planTier: number
    createdAt: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    credits?: true
  }

  export type UserSumAggregateInputType = {
    credits?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    password?: true
    role?: true
    stripeCustomerId?: true
    credits?: true
    planTier?: true
    createdAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    password?: true
    role?: true
    stripeCustomerId?: true
    credits?: true
    planTier?: true
    createdAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    password?: true
    role?: true
    stripeCustomerId?: true
    credits?: true
    planTier?: true
    createdAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    password: string | null
    role: $Enums.UserRole
    stripeCustomerId: string | null
    credits: number | null
    planTier: string | null
    createdAt: Date | null
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    stripeCustomerId?: boolean
    credits?: boolean
    planTier?: boolean
    createdAt?: boolean
    resumes?: boolean | User$resumesArgs<ExtArgs>
    campaigns?: boolean | User$campaignsArgs<ExtArgs>
    jobApplications?: boolean | User$jobApplicationsArgs<ExtArgs>
    transaction?: boolean | User$transactionArgs<ExtArgs>
    stripeTransaction?: boolean | User$stripeTransactionArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    stripeCustomerId?: boolean
    credits?: boolean
    planTier?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    stripeCustomerId?: boolean
    credits?: boolean
    planTier?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    stripeCustomerId?: boolean
    credits?: boolean
    planTier?: boolean
    createdAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "password" | "role" | "stripeCustomerId" | "credits" | "planTier" | "createdAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    resumes?: boolean | User$resumesArgs<ExtArgs>
    campaigns?: boolean | User$campaignsArgs<ExtArgs>
    jobApplications?: boolean | User$jobApplicationsArgs<ExtArgs>
    transaction?: boolean | User$transactionArgs<ExtArgs>
    stripeTransaction?: boolean | User$stripeTransactionArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      resumes: Prisma.$ResumePayload<ExtArgs>[]
      campaigns: Prisma.$CampaignPayload<ExtArgs>[]
      jobApplications: Prisma.$JobApplicationPayload<ExtArgs>[]
      transaction: Prisma.$TransactionPayload<ExtArgs>[]
      stripeTransaction: Prisma.$TransactionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      password: string | null
      role: $Enums.UserRole
      stripeCustomerId: string | null
      credits: number | null
      planTier: string | null
      createdAt: Date | null
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    resumes<T extends User$resumesArgs<ExtArgs> = {}>(args?: Subset<T, User$resumesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ResumePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    campaigns<T extends User$campaignsArgs<ExtArgs> = {}>(args?: Subset<T, User$campaignsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CampaignPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    jobApplications<T extends User$jobApplicationsArgs<ExtArgs> = {}>(args?: Subset<T, User$jobApplicationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JobApplicationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    transaction<T extends User$transactionArgs<ExtArgs> = {}>(args?: Subset<T, User$transactionArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    stripeTransaction<T extends User$stripeTransactionArgs<ExtArgs> = {}>(args?: Subset<T, User$stripeTransactionArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'UserRole'>
    readonly stripeCustomerId: FieldRef<"User", 'String'>
    readonly credits: FieldRef<"User", 'Int'>
    readonly planTier: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.resumes
   */
  export type User$resumesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resume
     */
    select?: ResumeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resume
     */
    omit?: ResumeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeInclude<ExtArgs> | null
    where?: ResumeWhereInput
    orderBy?: ResumeOrderByWithRelationInput | ResumeOrderByWithRelationInput[]
    cursor?: ResumeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ResumeScalarFieldEnum | ResumeScalarFieldEnum[]
  }

  /**
   * User.campaigns
   */
  export type User$campaignsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Campaign
     */
    select?: CampaignSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Campaign
     */
    omit?: CampaignOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CampaignInclude<ExtArgs> | null
    where?: CampaignWhereInput
    orderBy?: CampaignOrderByWithRelationInput | CampaignOrderByWithRelationInput[]
    cursor?: CampaignWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CampaignScalarFieldEnum | CampaignScalarFieldEnum[]
  }

  /**
   * User.jobApplications
   */
  export type User$jobApplicationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobApplication
     */
    select?: JobApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JobApplication
     */
    omit?: JobApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobApplicationInclude<ExtArgs> | null
    where?: JobApplicationWhereInput
    orderBy?: JobApplicationOrderByWithRelationInput | JobApplicationOrderByWithRelationInput[]
    cursor?: JobApplicationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: JobApplicationScalarFieldEnum | JobApplicationScalarFieldEnum[]
  }

  /**
   * User.transaction
   */
  export type User$transactionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    where?: TransactionWhereInput
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    cursor?: TransactionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * User.stripeTransaction
   */
  export type User$stripeTransactionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    where?: TransactionWhereInput
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    cursor?: TransactionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Transaction
   */

  export type AggregateTransaction = {
    _count: TransactionCountAggregateOutputType | null
    _avg: TransactionAvgAggregateOutputType | null
    _sum: TransactionSumAggregateOutputType | null
    _min: TransactionMinAggregateOutputType | null
    _max: TransactionMaxAggregateOutputType | null
  }

  export type TransactionAvgAggregateOutputType = {
    amount: number | null
  }

  export type TransactionSumAggregateOutputType = {
    amount: number | null
  }

  export type TransactionMinAggregateOutputType = {
    id: string | null
    userId: string | null
    amount: number | null
    type: $Enums.TransactionType | null
    reference_id: string | null
    description: string | null
    created_at: Date | null
  }

  export type TransactionMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    amount: number | null
    type: $Enums.TransactionType | null
    reference_id: string | null
    description: string | null
    created_at: Date | null
  }

  export type TransactionCountAggregateOutputType = {
    id: number
    userId: number
    amount: number
    type: number
    reference_id: number
    description: number
    created_at: number
    _all: number
  }


  export type TransactionAvgAggregateInputType = {
    amount?: true
  }

  export type TransactionSumAggregateInputType = {
    amount?: true
  }

  export type TransactionMinAggregateInputType = {
    id?: true
    userId?: true
    amount?: true
    type?: true
    reference_id?: true
    description?: true
    created_at?: true
  }

  export type TransactionMaxAggregateInputType = {
    id?: true
    userId?: true
    amount?: true
    type?: true
    reference_id?: true
    description?: true
    created_at?: true
  }

  export type TransactionCountAggregateInputType = {
    id?: true
    userId?: true
    amount?: true
    type?: true
    reference_id?: true
    description?: true
    created_at?: true
    _all?: true
  }

  export type TransactionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Transaction to aggregate.
     */
    where?: TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Transactions
    **/
    _count?: true | TransactionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TransactionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TransactionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TransactionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TransactionMaxAggregateInputType
  }

  export type GetTransactionAggregateType<T extends TransactionAggregateArgs> = {
        [P in keyof T & keyof AggregateTransaction]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTransaction[P]>
      : GetScalarType<T[P], AggregateTransaction[P]>
  }




  export type TransactionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TransactionWhereInput
    orderBy?: TransactionOrderByWithAggregationInput | TransactionOrderByWithAggregationInput[]
    by: TransactionScalarFieldEnum[] | TransactionScalarFieldEnum
    having?: TransactionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TransactionCountAggregateInputType | true
    _avg?: TransactionAvgAggregateInputType
    _sum?: TransactionSumAggregateInputType
    _min?: TransactionMinAggregateInputType
    _max?: TransactionMaxAggregateInputType
  }

  export type TransactionGroupByOutputType = {
    id: string
    userId: string | null
    amount: number | null
    type: $Enums.TransactionType | null
    reference_id: string | null
    description: string | null
    created_at: Date | null
    _count: TransactionCountAggregateOutputType | null
    _avg: TransactionAvgAggregateOutputType | null
    _sum: TransactionSumAggregateOutputType | null
    _min: TransactionMinAggregateOutputType | null
    _max: TransactionMaxAggregateOutputType | null
  }

  type GetTransactionGroupByPayload<T extends TransactionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TransactionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TransactionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TransactionGroupByOutputType[P]>
            : GetScalarType<T[P], TransactionGroupByOutputType[P]>
        }
      >
    >


  export type TransactionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    amount?: boolean
    type?: boolean
    reference_id?: boolean
    description?: boolean
    created_at?: boolean
    user?: boolean | Transaction$userArgs<ExtArgs>
    stripeCustomer?: boolean | Transaction$stripeCustomerArgs<ExtArgs>
  }, ExtArgs["result"]["transaction"]>

  export type TransactionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    amount?: boolean
    type?: boolean
    reference_id?: boolean
    description?: boolean
    created_at?: boolean
    user?: boolean | Transaction$userArgs<ExtArgs>
    stripeCustomer?: boolean | Transaction$stripeCustomerArgs<ExtArgs>
  }, ExtArgs["result"]["transaction"]>

  export type TransactionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    amount?: boolean
    type?: boolean
    reference_id?: boolean
    description?: boolean
    created_at?: boolean
    user?: boolean | Transaction$userArgs<ExtArgs>
    stripeCustomer?: boolean | Transaction$stripeCustomerArgs<ExtArgs>
  }, ExtArgs["result"]["transaction"]>

  export type TransactionSelectScalar = {
    id?: boolean
    userId?: boolean
    amount?: boolean
    type?: boolean
    reference_id?: boolean
    description?: boolean
    created_at?: boolean
  }

  export type TransactionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "amount" | "type" | "reference_id" | "description" | "created_at", ExtArgs["result"]["transaction"]>
  export type TransactionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Transaction$userArgs<ExtArgs>
    stripeCustomer?: boolean | Transaction$stripeCustomerArgs<ExtArgs>
  }
  export type TransactionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Transaction$userArgs<ExtArgs>
    stripeCustomer?: boolean | Transaction$stripeCustomerArgs<ExtArgs>
  }
  export type TransactionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Transaction$userArgs<ExtArgs>
    stripeCustomer?: boolean | Transaction$stripeCustomerArgs<ExtArgs>
  }

  export type $TransactionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Transaction"
    objects: {
      user: Prisma.$UserPayload<ExtArgs> | null
      stripeCustomer: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string | null
      amount: number | null
      type: $Enums.TransactionType | null
      reference_id: string | null
      description: string | null
      created_at: Date | null
    }, ExtArgs["result"]["transaction"]>
    composites: {}
  }

  type TransactionGetPayload<S extends boolean | null | undefined | TransactionDefaultArgs> = $Result.GetResult<Prisma.$TransactionPayload, S>

  type TransactionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TransactionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TransactionCountAggregateInputType | true
    }

  export interface TransactionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Transaction'], meta: { name: 'Transaction' } }
    /**
     * Find zero or one Transaction that matches the filter.
     * @param {TransactionFindUniqueArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TransactionFindUniqueArgs>(args: SelectSubset<T, TransactionFindUniqueArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Transaction that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TransactionFindUniqueOrThrowArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TransactionFindUniqueOrThrowArgs>(args: SelectSubset<T, TransactionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Transaction that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionFindFirstArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TransactionFindFirstArgs>(args?: SelectSubset<T, TransactionFindFirstArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Transaction that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionFindFirstOrThrowArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TransactionFindFirstOrThrowArgs>(args?: SelectSubset<T, TransactionFindFirstOrThrowArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Transactions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Transactions
     * const transactions = await prisma.transaction.findMany()
     * 
     * // Get first 10 Transactions
     * const transactions = await prisma.transaction.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const transactionWithIdOnly = await prisma.transaction.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TransactionFindManyArgs>(args?: SelectSubset<T, TransactionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Transaction.
     * @param {TransactionCreateArgs} args - Arguments to create a Transaction.
     * @example
     * // Create one Transaction
     * const Transaction = await prisma.transaction.create({
     *   data: {
     *     // ... data to create a Transaction
     *   }
     * })
     * 
     */
    create<T extends TransactionCreateArgs>(args: SelectSubset<T, TransactionCreateArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Transactions.
     * @param {TransactionCreateManyArgs} args - Arguments to create many Transactions.
     * @example
     * // Create many Transactions
     * const transaction = await prisma.transaction.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TransactionCreateManyArgs>(args?: SelectSubset<T, TransactionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Transactions and returns the data saved in the database.
     * @param {TransactionCreateManyAndReturnArgs} args - Arguments to create many Transactions.
     * @example
     * // Create many Transactions
     * const transaction = await prisma.transaction.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Transactions and only return the `id`
     * const transactionWithIdOnly = await prisma.transaction.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TransactionCreateManyAndReturnArgs>(args?: SelectSubset<T, TransactionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Transaction.
     * @param {TransactionDeleteArgs} args - Arguments to delete one Transaction.
     * @example
     * // Delete one Transaction
     * const Transaction = await prisma.transaction.delete({
     *   where: {
     *     // ... filter to delete one Transaction
     *   }
     * })
     * 
     */
    delete<T extends TransactionDeleteArgs>(args: SelectSubset<T, TransactionDeleteArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Transaction.
     * @param {TransactionUpdateArgs} args - Arguments to update one Transaction.
     * @example
     * // Update one Transaction
     * const transaction = await prisma.transaction.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TransactionUpdateArgs>(args: SelectSubset<T, TransactionUpdateArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Transactions.
     * @param {TransactionDeleteManyArgs} args - Arguments to filter Transactions to delete.
     * @example
     * // Delete a few Transactions
     * const { count } = await prisma.transaction.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TransactionDeleteManyArgs>(args?: SelectSubset<T, TransactionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Transactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Transactions
     * const transaction = await prisma.transaction.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TransactionUpdateManyArgs>(args: SelectSubset<T, TransactionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Transactions and returns the data updated in the database.
     * @param {TransactionUpdateManyAndReturnArgs} args - Arguments to update many Transactions.
     * @example
     * // Update many Transactions
     * const transaction = await prisma.transaction.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Transactions and only return the `id`
     * const transactionWithIdOnly = await prisma.transaction.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TransactionUpdateManyAndReturnArgs>(args: SelectSubset<T, TransactionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Transaction.
     * @param {TransactionUpsertArgs} args - Arguments to update or create a Transaction.
     * @example
     * // Update or create a Transaction
     * const transaction = await prisma.transaction.upsert({
     *   create: {
     *     // ... data to create a Transaction
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Transaction we want to update
     *   }
     * })
     */
    upsert<T extends TransactionUpsertArgs>(args: SelectSubset<T, TransactionUpsertArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Transactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionCountArgs} args - Arguments to filter Transactions to count.
     * @example
     * // Count the number of Transactions
     * const count = await prisma.transaction.count({
     *   where: {
     *     // ... the filter for the Transactions we want to count
     *   }
     * })
    **/
    count<T extends TransactionCountArgs>(
      args?: Subset<T, TransactionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TransactionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Transaction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TransactionAggregateArgs>(args: Subset<T, TransactionAggregateArgs>): Prisma.PrismaPromise<GetTransactionAggregateType<T>>

    /**
     * Group by Transaction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TransactionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TransactionGroupByArgs['orderBy'] }
        : { orderBy?: TransactionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TransactionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTransactionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Transaction model
   */
  readonly fields: TransactionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Transaction.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TransactionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends Transaction$userArgs<ExtArgs> = {}>(args?: Subset<T, Transaction$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    stripeCustomer<T extends Transaction$stripeCustomerArgs<ExtArgs> = {}>(args?: Subset<T, Transaction$stripeCustomerArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Transaction model
   */
  interface TransactionFieldRefs {
    readonly id: FieldRef<"Transaction", 'String'>
    readonly userId: FieldRef<"Transaction", 'String'>
    readonly amount: FieldRef<"Transaction", 'Int'>
    readonly type: FieldRef<"Transaction", 'TransactionType'>
    readonly reference_id: FieldRef<"Transaction", 'String'>
    readonly description: FieldRef<"Transaction", 'String'>
    readonly created_at: FieldRef<"Transaction", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Transaction findUnique
   */
  export type TransactionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transaction to fetch.
     */
    where: TransactionWhereUniqueInput
  }

  /**
   * Transaction findUniqueOrThrow
   */
  export type TransactionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transaction to fetch.
     */
    where: TransactionWhereUniqueInput
  }

  /**
   * Transaction findFirst
   */
  export type TransactionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transaction to fetch.
     */
    where?: TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Transactions.
     */
    cursor?: TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Transactions.
     */
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * Transaction findFirstOrThrow
   */
  export type TransactionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transaction to fetch.
     */
    where?: TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Transactions.
     */
    cursor?: TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Transactions.
     */
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * Transaction findMany
   */
  export type TransactionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transactions to fetch.
     */
    where?: TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Transactions.
     */
    cursor?: TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * Transaction create
   */
  export type TransactionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * The data needed to create a Transaction.
     */
    data?: XOR<TransactionCreateInput, TransactionUncheckedCreateInput>
  }

  /**
   * Transaction createMany
   */
  export type TransactionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Transactions.
     */
    data: TransactionCreateManyInput | TransactionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Transaction createManyAndReturn
   */
  export type TransactionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * The data used to create many Transactions.
     */
    data: TransactionCreateManyInput | TransactionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Transaction update
   */
  export type TransactionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * The data needed to update a Transaction.
     */
    data: XOR<TransactionUpdateInput, TransactionUncheckedUpdateInput>
    /**
     * Choose, which Transaction to update.
     */
    where: TransactionWhereUniqueInput
  }

  /**
   * Transaction updateMany
   */
  export type TransactionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Transactions.
     */
    data: XOR<TransactionUpdateManyMutationInput, TransactionUncheckedUpdateManyInput>
    /**
     * Filter which Transactions to update
     */
    where?: TransactionWhereInput
    /**
     * Limit how many Transactions to update.
     */
    limit?: number
  }

  /**
   * Transaction updateManyAndReturn
   */
  export type TransactionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * The data used to update Transactions.
     */
    data: XOR<TransactionUpdateManyMutationInput, TransactionUncheckedUpdateManyInput>
    /**
     * Filter which Transactions to update
     */
    where?: TransactionWhereInput
    /**
     * Limit how many Transactions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Transaction upsert
   */
  export type TransactionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * The filter to search for the Transaction to update in case it exists.
     */
    where: TransactionWhereUniqueInput
    /**
     * In case the Transaction found by the `where` argument doesn't exist, create a new Transaction with this data.
     */
    create: XOR<TransactionCreateInput, TransactionUncheckedCreateInput>
    /**
     * In case the Transaction was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TransactionUpdateInput, TransactionUncheckedUpdateInput>
  }

  /**
   * Transaction delete
   */
  export type TransactionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter which Transaction to delete.
     */
    where: TransactionWhereUniqueInput
  }

  /**
   * Transaction deleteMany
   */
  export type TransactionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Transactions to delete
     */
    where?: TransactionWhereInput
    /**
     * Limit how many Transactions to delete.
     */
    limit?: number
  }

  /**
   * Transaction.user
   */
  export type Transaction$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Transaction.stripeCustomer
   */
  export type Transaction$stripeCustomerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Transaction without action
   */
  export type TransactionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
  }


  /**
   * Model Resume
   */

  export type AggregateResume = {
    _count: ResumeCountAggregateOutputType | null
    _min: ResumeMinAggregateOutputType | null
    _max: ResumeMaxAggregateOutputType | null
  }

  export type ResumeMinAggregateOutputType = {
    id: string | null
    userId: string | null
    title: string | null
    isDefault: boolean | null
    createdAt: Date | null
  }

  export type ResumeMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    title: string | null
    isDefault: boolean | null
    createdAt: Date | null
  }

  export type ResumeCountAggregateOutputType = {
    id: number
    userId: number
    title: number
    personalInfo: number
    education: number
    experience: number
    skills: number
    isDefault: number
    createdAt: number
    _all: number
  }


  export type ResumeMinAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    isDefault?: true
    createdAt?: true
  }

  export type ResumeMaxAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    isDefault?: true
    createdAt?: true
  }

  export type ResumeCountAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    personalInfo?: true
    education?: true
    experience?: true
    skills?: true
    isDefault?: true
    createdAt?: true
    _all?: true
  }

  export type ResumeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Resume to aggregate.
     */
    where?: ResumeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Resumes to fetch.
     */
    orderBy?: ResumeOrderByWithRelationInput | ResumeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ResumeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Resumes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Resumes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Resumes
    **/
    _count?: true | ResumeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ResumeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ResumeMaxAggregateInputType
  }

  export type GetResumeAggregateType<T extends ResumeAggregateArgs> = {
        [P in keyof T & keyof AggregateResume]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateResume[P]>
      : GetScalarType<T[P], AggregateResume[P]>
  }




  export type ResumeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ResumeWhereInput
    orderBy?: ResumeOrderByWithAggregationInput | ResumeOrderByWithAggregationInput[]
    by: ResumeScalarFieldEnum[] | ResumeScalarFieldEnum
    having?: ResumeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ResumeCountAggregateInputType | true
    _min?: ResumeMinAggregateInputType
    _max?: ResumeMaxAggregateInputType
  }

  export type ResumeGroupByOutputType = {
    id: string
    userId: string | null
    title: string | null
    personalInfo: JsonValue | null
    education: JsonValue | null
    experience: JsonValue | null
    skills: JsonValue | null
    isDefault: boolean | null
    createdAt: Date | null
    _count: ResumeCountAggregateOutputType | null
    _min: ResumeMinAggregateOutputType | null
    _max: ResumeMaxAggregateOutputType | null
  }

  type GetResumeGroupByPayload<T extends ResumeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ResumeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ResumeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ResumeGroupByOutputType[P]>
            : GetScalarType<T[P], ResumeGroupByOutputType[P]>
        }
      >
    >


  export type ResumeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    personalInfo?: boolean
    education?: boolean
    experience?: boolean
    skills?: boolean
    isDefault?: boolean
    createdAt?: boolean
    user?: boolean | Resume$userArgs<ExtArgs>
    campaigns?: boolean | Resume$campaignsArgs<ExtArgs>
    _count?: boolean | ResumeCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["resume"]>

  export type ResumeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    personalInfo?: boolean
    education?: boolean
    experience?: boolean
    skills?: boolean
    isDefault?: boolean
    createdAt?: boolean
    user?: boolean | Resume$userArgs<ExtArgs>
  }, ExtArgs["result"]["resume"]>

  export type ResumeSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    personalInfo?: boolean
    education?: boolean
    experience?: boolean
    skills?: boolean
    isDefault?: boolean
    createdAt?: boolean
    user?: boolean | Resume$userArgs<ExtArgs>
  }, ExtArgs["result"]["resume"]>

  export type ResumeSelectScalar = {
    id?: boolean
    userId?: boolean
    title?: boolean
    personalInfo?: boolean
    education?: boolean
    experience?: boolean
    skills?: boolean
    isDefault?: boolean
    createdAt?: boolean
  }

  export type ResumeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "title" | "personalInfo" | "education" | "experience" | "skills" | "isDefault" | "createdAt", ExtArgs["result"]["resume"]>
  export type ResumeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Resume$userArgs<ExtArgs>
    campaigns?: boolean | Resume$campaignsArgs<ExtArgs>
    _count?: boolean | ResumeCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ResumeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Resume$userArgs<ExtArgs>
  }
  export type ResumeIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Resume$userArgs<ExtArgs>
  }

  export type $ResumePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Resume"
    objects: {
      user: Prisma.$UserPayload<ExtArgs> | null
      campaigns: Prisma.$CampaignPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string | null
      title: string | null
      personalInfo: Prisma.JsonValue | null
      education: Prisma.JsonValue | null
      experience: Prisma.JsonValue | null
      skills: Prisma.JsonValue | null
      isDefault: boolean | null
      createdAt: Date | null
    }, ExtArgs["result"]["resume"]>
    composites: {}
  }

  type ResumeGetPayload<S extends boolean | null | undefined | ResumeDefaultArgs> = $Result.GetResult<Prisma.$ResumePayload, S>

  type ResumeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ResumeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ResumeCountAggregateInputType | true
    }

  export interface ResumeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Resume'], meta: { name: 'Resume' } }
    /**
     * Find zero or one Resume that matches the filter.
     * @param {ResumeFindUniqueArgs} args - Arguments to find a Resume
     * @example
     * // Get one Resume
     * const resume = await prisma.resume.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ResumeFindUniqueArgs>(args: SelectSubset<T, ResumeFindUniqueArgs<ExtArgs>>): Prisma__ResumeClient<$Result.GetResult<Prisma.$ResumePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Resume that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ResumeFindUniqueOrThrowArgs} args - Arguments to find a Resume
     * @example
     * // Get one Resume
     * const resume = await prisma.resume.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ResumeFindUniqueOrThrowArgs>(args: SelectSubset<T, ResumeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ResumeClient<$Result.GetResult<Prisma.$ResumePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Resume that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResumeFindFirstArgs} args - Arguments to find a Resume
     * @example
     * // Get one Resume
     * const resume = await prisma.resume.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ResumeFindFirstArgs>(args?: SelectSubset<T, ResumeFindFirstArgs<ExtArgs>>): Prisma__ResumeClient<$Result.GetResult<Prisma.$ResumePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Resume that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResumeFindFirstOrThrowArgs} args - Arguments to find a Resume
     * @example
     * // Get one Resume
     * const resume = await prisma.resume.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ResumeFindFirstOrThrowArgs>(args?: SelectSubset<T, ResumeFindFirstOrThrowArgs<ExtArgs>>): Prisma__ResumeClient<$Result.GetResult<Prisma.$ResumePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Resumes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResumeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Resumes
     * const resumes = await prisma.resume.findMany()
     * 
     * // Get first 10 Resumes
     * const resumes = await prisma.resume.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const resumeWithIdOnly = await prisma.resume.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ResumeFindManyArgs>(args?: SelectSubset<T, ResumeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ResumePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Resume.
     * @param {ResumeCreateArgs} args - Arguments to create a Resume.
     * @example
     * // Create one Resume
     * const Resume = await prisma.resume.create({
     *   data: {
     *     // ... data to create a Resume
     *   }
     * })
     * 
     */
    create<T extends ResumeCreateArgs>(args: SelectSubset<T, ResumeCreateArgs<ExtArgs>>): Prisma__ResumeClient<$Result.GetResult<Prisma.$ResumePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Resumes.
     * @param {ResumeCreateManyArgs} args - Arguments to create many Resumes.
     * @example
     * // Create many Resumes
     * const resume = await prisma.resume.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ResumeCreateManyArgs>(args?: SelectSubset<T, ResumeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Resumes and returns the data saved in the database.
     * @param {ResumeCreateManyAndReturnArgs} args - Arguments to create many Resumes.
     * @example
     * // Create many Resumes
     * const resume = await prisma.resume.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Resumes and only return the `id`
     * const resumeWithIdOnly = await prisma.resume.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ResumeCreateManyAndReturnArgs>(args?: SelectSubset<T, ResumeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ResumePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Resume.
     * @param {ResumeDeleteArgs} args - Arguments to delete one Resume.
     * @example
     * // Delete one Resume
     * const Resume = await prisma.resume.delete({
     *   where: {
     *     // ... filter to delete one Resume
     *   }
     * })
     * 
     */
    delete<T extends ResumeDeleteArgs>(args: SelectSubset<T, ResumeDeleteArgs<ExtArgs>>): Prisma__ResumeClient<$Result.GetResult<Prisma.$ResumePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Resume.
     * @param {ResumeUpdateArgs} args - Arguments to update one Resume.
     * @example
     * // Update one Resume
     * const resume = await prisma.resume.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ResumeUpdateArgs>(args: SelectSubset<T, ResumeUpdateArgs<ExtArgs>>): Prisma__ResumeClient<$Result.GetResult<Prisma.$ResumePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Resumes.
     * @param {ResumeDeleteManyArgs} args - Arguments to filter Resumes to delete.
     * @example
     * // Delete a few Resumes
     * const { count } = await prisma.resume.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ResumeDeleteManyArgs>(args?: SelectSubset<T, ResumeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Resumes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResumeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Resumes
     * const resume = await prisma.resume.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ResumeUpdateManyArgs>(args: SelectSubset<T, ResumeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Resumes and returns the data updated in the database.
     * @param {ResumeUpdateManyAndReturnArgs} args - Arguments to update many Resumes.
     * @example
     * // Update many Resumes
     * const resume = await prisma.resume.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Resumes and only return the `id`
     * const resumeWithIdOnly = await prisma.resume.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ResumeUpdateManyAndReturnArgs>(args: SelectSubset<T, ResumeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ResumePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Resume.
     * @param {ResumeUpsertArgs} args - Arguments to update or create a Resume.
     * @example
     * // Update or create a Resume
     * const resume = await prisma.resume.upsert({
     *   create: {
     *     // ... data to create a Resume
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Resume we want to update
     *   }
     * })
     */
    upsert<T extends ResumeUpsertArgs>(args: SelectSubset<T, ResumeUpsertArgs<ExtArgs>>): Prisma__ResumeClient<$Result.GetResult<Prisma.$ResumePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Resumes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResumeCountArgs} args - Arguments to filter Resumes to count.
     * @example
     * // Count the number of Resumes
     * const count = await prisma.resume.count({
     *   where: {
     *     // ... the filter for the Resumes we want to count
     *   }
     * })
    **/
    count<T extends ResumeCountArgs>(
      args?: Subset<T, ResumeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ResumeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Resume.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResumeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ResumeAggregateArgs>(args: Subset<T, ResumeAggregateArgs>): Prisma.PrismaPromise<GetResumeAggregateType<T>>

    /**
     * Group by Resume.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResumeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ResumeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ResumeGroupByArgs['orderBy'] }
        : { orderBy?: ResumeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ResumeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetResumeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Resume model
   */
  readonly fields: ResumeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Resume.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ResumeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends Resume$userArgs<ExtArgs> = {}>(args?: Subset<T, Resume$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    campaigns<T extends Resume$campaignsArgs<ExtArgs> = {}>(args?: Subset<T, Resume$campaignsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CampaignPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Resume model
   */
  interface ResumeFieldRefs {
    readonly id: FieldRef<"Resume", 'String'>
    readonly userId: FieldRef<"Resume", 'String'>
    readonly title: FieldRef<"Resume", 'String'>
    readonly personalInfo: FieldRef<"Resume", 'Json'>
    readonly education: FieldRef<"Resume", 'Json'>
    readonly experience: FieldRef<"Resume", 'Json'>
    readonly skills: FieldRef<"Resume", 'Json'>
    readonly isDefault: FieldRef<"Resume", 'Boolean'>
    readonly createdAt: FieldRef<"Resume", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Resume findUnique
   */
  export type ResumeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resume
     */
    select?: ResumeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resume
     */
    omit?: ResumeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeInclude<ExtArgs> | null
    /**
     * Filter, which Resume to fetch.
     */
    where: ResumeWhereUniqueInput
  }

  /**
   * Resume findUniqueOrThrow
   */
  export type ResumeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resume
     */
    select?: ResumeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resume
     */
    omit?: ResumeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeInclude<ExtArgs> | null
    /**
     * Filter, which Resume to fetch.
     */
    where: ResumeWhereUniqueInput
  }

  /**
   * Resume findFirst
   */
  export type ResumeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resume
     */
    select?: ResumeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resume
     */
    omit?: ResumeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeInclude<ExtArgs> | null
    /**
     * Filter, which Resume to fetch.
     */
    where?: ResumeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Resumes to fetch.
     */
    orderBy?: ResumeOrderByWithRelationInput | ResumeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Resumes.
     */
    cursor?: ResumeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Resumes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Resumes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Resumes.
     */
    distinct?: ResumeScalarFieldEnum | ResumeScalarFieldEnum[]
  }

  /**
   * Resume findFirstOrThrow
   */
  export type ResumeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resume
     */
    select?: ResumeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resume
     */
    omit?: ResumeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeInclude<ExtArgs> | null
    /**
     * Filter, which Resume to fetch.
     */
    where?: ResumeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Resumes to fetch.
     */
    orderBy?: ResumeOrderByWithRelationInput | ResumeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Resumes.
     */
    cursor?: ResumeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Resumes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Resumes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Resumes.
     */
    distinct?: ResumeScalarFieldEnum | ResumeScalarFieldEnum[]
  }

  /**
   * Resume findMany
   */
  export type ResumeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resume
     */
    select?: ResumeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resume
     */
    omit?: ResumeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeInclude<ExtArgs> | null
    /**
     * Filter, which Resumes to fetch.
     */
    where?: ResumeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Resumes to fetch.
     */
    orderBy?: ResumeOrderByWithRelationInput | ResumeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Resumes.
     */
    cursor?: ResumeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Resumes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Resumes.
     */
    skip?: number
    distinct?: ResumeScalarFieldEnum | ResumeScalarFieldEnum[]
  }

  /**
   * Resume create
   */
  export type ResumeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resume
     */
    select?: ResumeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resume
     */
    omit?: ResumeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeInclude<ExtArgs> | null
    /**
     * The data needed to create a Resume.
     */
    data?: XOR<ResumeCreateInput, ResumeUncheckedCreateInput>
  }

  /**
   * Resume createMany
   */
  export type ResumeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Resumes.
     */
    data: ResumeCreateManyInput | ResumeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Resume createManyAndReturn
   */
  export type ResumeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resume
     */
    select?: ResumeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Resume
     */
    omit?: ResumeOmit<ExtArgs> | null
    /**
     * The data used to create many Resumes.
     */
    data: ResumeCreateManyInput | ResumeCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Resume update
   */
  export type ResumeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resume
     */
    select?: ResumeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resume
     */
    omit?: ResumeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeInclude<ExtArgs> | null
    /**
     * The data needed to update a Resume.
     */
    data: XOR<ResumeUpdateInput, ResumeUncheckedUpdateInput>
    /**
     * Choose, which Resume to update.
     */
    where: ResumeWhereUniqueInput
  }

  /**
   * Resume updateMany
   */
  export type ResumeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Resumes.
     */
    data: XOR<ResumeUpdateManyMutationInput, ResumeUncheckedUpdateManyInput>
    /**
     * Filter which Resumes to update
     */
    where?: ResumeWhereInput
    /**
     * Limit how many Resumes to update.
     */
    limit?: number
  }

  /**
   * Resume updateManyAndReturn
   */
  export type ResumeUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resume
     */
    select?: ResumeSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Resume
     */
    omit?: ResumeOmit<ExtArgs> | null
    /**
     * The data used to update Resumes.
     */
    data: XOR<ResumeUpdateManyMutationInput, ResumeUncheckedUpdateManyInput>
    /**
     * Filter which Resumes to update
     */
    where?: ResumeWhereInput
    /**
     * Limit how many Resumes to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Resume upsert
   */
  export type ResumeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resume
     */
    select?: ResumeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resume
     */
    omit?: ResumeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeInclude<ExtArgs> | null
    /**
     * The filter to search for the Resume to update in case it exists.
     */
    where: ResumeWhereUniqueInput
    /**
     * In case the Resume found by the `where` argument doesn't exist, create a new Resume with this data.
     */
    create: XOR<ResumeCreateInput, ResumeUncheckedCreateInput>
    /**
     * In case the Resume was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ResumeUpdateInput, ResumeUncheckedUpdateInput>
  }

  /**
   * Resume delete
   */
  export type ResumeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resume
     */
    select?: ResumeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resume
     */
    omit?: ResumeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeInclude<ExtArgs> | null
    /**
     * Filter which Resume to delete.
     */
    where: ResumeWhereUniqueInput
  }

  /**
   * Resume deleteMany
   */
  export type ResumeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Resumes to delete
     */
    where?: ResumeWhereInput
    /**
     * Limit how many Resumes to delete.
     */
    limit?: number
  }

  /**
   * Resume.user
   */
  export type Resume$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Resume.campaigns
   */
  export type Resume$campaignsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Campaign
     */
    select?: CampaignSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Campaign
     */
    omit?: CampaignOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CampaignInclude<ExtArgs> | null
    where?: CampaignWhereInput
    orderBy?: CampaignOrderByWithRelationInput | CampaignOrderByWithRelationInput[]
    cursor?: CampaignWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CampaignScalarFieldEnum | CampaignScalarFieldEnum[]
  }

  /**
   * Resume without action
   */
  export type ResumeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resume
     */
    select?: ResumeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resume
     */
    omit?: ResumeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeInclude<ExtArgs> | null
  }


  /**
   * Model Campaign
   */

  export type AggregateCampaign = {
    _count: CampaignCountAggregateOutputType | null
    _avg: CampaignAvgAggregateOutputType | null
    _sum: CampaignSumAggregateOutputType | null
    _min: CampaignMinAggregateOutputType | null
    _max: CampaignMaxAggregateOutputType | null
  }

  export type CampaignAvgAggregateOutputType = {
    dailyLimit: number | null
  }

  export type CampaignSumAggregateOutputType = {
    dailyLimit: number | null
  }

  export type CampaignMinAggregateOutputType = {
    id: string | null
    resumeId: string | null
    userId: string | null
    name: string | null
    platform: $Enums.Platform | null
    status: string | null
    dailyLimit: number | null
    createdAt: Date | null
  }

  export type CampaignMaxAggregateOutputType = {
    id: string | null
    resumeId: string | null
    userId: string | null
    name: string | null
    platform: $Enums.Platform | null
    status: string | null
    dailyLimit: number | null
    createdAt: Date | null
  }

  export type CampaignCountAggregateOutputType = {
    id: number
    resumeId: number
    userId: number
    name: number
    platform: number
    status: number
    dailyLimit: number
    createdAt: number
    _all: number
  }


  export type CampaignAvgAggregateInputType = {
    dailyLimit?: true
  }

  export type CampaignSumAggregateInputType = {
    dailyLimit?: true
  }

  export type CampaignMinAggregateInputType = {
    id?: true
    resumeId?: true
    userId?: true
    name?: true
    platform?: true
    status?: true
    dailyLimit?: true
    createdAt?: true
  }

  export type CampaignMaxAggregateInputType = {
    id?: true
    resumeId?: true
    userId?: true
    name?: true
    platform?: true
    status?: true
    dailyLimit?: true
    createdAt?: true
  }

  export type CampaignCountAggregateInputType = {
    id?: true
    resumeId?: true
    userId?: true
    name?: true
    platform?: true
    status?: true
    dailyLimit?: true
    createdAt?: true
    _all?: true
  }

  export type CampaignAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Campaign to aggregate.
     */
    where?: CampaignWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Campaigns to fetch.
     */
    orderBy?: CampaignOrderByWithRelationInput | CampaignOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CampaignWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Campaigns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Campaigns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Campaigns
    **/
    _count?: true | CampaignCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CampaignAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CampaignSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CampaignMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CampaignMaxAggregateInputType
  }

  export type GetCampaignAggregateType<T extends CampaignAggregateArgs> = {
        [P in keyof T & keyof AggregateCampaign]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCampaign[P]>
      : GetScalarType<T[P], AggregateCampaign[P]>
  }




  export type CampaignGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CampaignWhereInput
    orderBy?: CampaignOrderByWithAggregationInput | CampaignOrderByWithAggregationInput[]
    by: CampaignScalarFieldEnum[] | CampaignScalarFieldEnum
    having?: CampaignScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CampaignCountAggregateInputType | true
    _avg?: CampaignAvgAggregateInputType
    _sum?: CampaignSumAggregateInputType
    _min?: CampaignMinAggregateInputType
    _max?: CampaignMaxAggregateInputType
  }

  export type CampaignGroupByOutputType = {
    id: string
    resumeId: string | null
    userId: string | null
    name: string | null
    platform: $Enums.Platform | null
    status: string | null
    dailyLimit: number | null
    createdAt: Date | null
    _count: CampaignCountAggregateOutputType | null
    _avg: CampaignAvgAggregateOutputType | null
    _sum: CampaignSumAggregateOutputType | null
    _min: CampaignMinAggregateOutputType | null
    _max: CampaignMaxAggregateOutputType | null
  }

  type GetCampaignGroupByPayload<T extends CampaignGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CampaignGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CampaignGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CampaignGroupByOutputType[P]>
            : GetScalarType<T[P], CampaignGroupByOutputType[P]>
        }
      >
    >


  export type CampaignSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    resumeId?: boolean
    userId?: boolean
    name?: boolean
    platform?: boolean
    status?: boolean
    dailyLimit?: boolean
    createdAt?: boolean
    resume?: boolean | Campaign$resumeArgs<ExtArgs>
    user?: boolean | Campaign$userArgs<ExtArgs>
    linkedinConfig?: boolean | Campaign$linkedinConfigArgs<ExtArgs>
    infojobsConfig?: boolean | Campaign$infojobsConfigArgs<ExtArgs>
    jobApplications?: boolean | Campaign$jobApplicationsArgs<ExtArgs>
    _count?: boolean | CampaignCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["campaign"]>

  export type CampaignSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    resumeId?: boolean
    userId?: boolean
    name?: boolean
    platform?: boolean
    status?: boolean
    dailyLimit?: boolean
    createdAt?: boolean
    resume?: boolean | Campaign$resumeArgs<ExtArgs>
    user?: boolean | Campaign$userArgs<ExtArgs>
  }, ExtArgs["result"]["campaign"]>

  export type CampaignSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    resumeId?: boolean
    userId?: boolean
    name?: boolean
    platform?: boolean
    status?: boolean
    dailyLimit?: boolean
    createdAt?: boolean
    resume?: boolean | Campaign$resumeArgs<ExtArgs>
    user?: boolean | Campaign$userArgs<ExtArgs>
  }, ExtArgs["result"]["campaign"]>

  export type CampaignSelectScalar = {
    id?: boolean
    resumeId?: boolean
    userId?: boolean
    name?: boolean
    platform?: boolean
    status?: boolean
    dailyLimit?: boolean
    createdAt?: boolean
  }

  export type CampaignOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "resumeId" | "userId" | "name" | "platform" | "status" | "dailyLimit" | "createdAt", ExtArgs["result"]["campaign"]>
  export type CampaignInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    resume?: boolean | Campaign$resumeArgs<ExtArgs>
    user?: boolean | Campaign$userArgs<ExtArgs>
    linkedinConfig?: boolean | Campaign$linkedinConfigArgs<ExtArgs>
    infojobsConfig?: boolean | Campaign$infojobsConfigArgs<ExtArgs>
    jobApplications?: boolean | Campaign$jobApplicationsArgs<ExtArgs>
    _count?: boolean | CampaignCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CampaignIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    resume?: boolean | Campaign$resumeArgs<ExtArgs>
    user?: boolean | Campaign$userArgs<ExtArgs>
  }
  export type CampaignIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    resume?: boolean | Campaign$resumeArgs<ExtArgs>
    user?: boolean | Campaign$userArgs<ExtArgs>
  }

  export type $CampaignPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Campaign"
    objects: {
      resume: Prisma.$ResumePayload<ExtArgs> | null
      user: Prisma.$UserPayload<ExtArgs> | null
      linkedinConfig: Prisma.$CampaignLinkedinPayload<ExtArgs> | null
      infojobsConfig: Prisma.$CampaignInfojobsPayload<ExtArgs> | null
      jobApplications: Prisma.$JobApplicationPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      resumeId: string | null
      userId: string | null
      name: string | null
      platform: $Enums.Platform | null
      status: string | null
      dailyLimit: number | null
      createdAt: Date | null
    }, ExtArgs["result"]["campaign"]>
    composites: {}
  }

  type CampaignGetPayload<S extends boolean | null | undefined | CampaignDefaultArgs> = $Result.GetResult<Prisma.$CampaignPayload, S>

  type CampaignCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CampaignFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CampaignCountAggregateInputType | true
    }

  export interface CampaignDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Campaign'], meta: { name: 'Campaign' } }
    /**
     * Find zero or one Campaign that matches the filter.
     * @param {CampaignFindUniqueArgs} args - Arguments to find a Campaign
     * @example
     * // Get one Campaign
     * const campaign = await prisma.campaign.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CampaignFindUniqueArgs>(args: SelectSubset<T, CampaignFindUniqueArgs<ExtArgs>>): Prisma__CampaignClient<$Result.GetResult<Prisma.$CampaignPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Campaign that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CampaignFindUniqueOrThrowArgs} args - Arguments to find a Campaign
     * @example
     * // Get one Campaign
     * const campaign = await prisma.campaign.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CampaignFindUniqueOrThrowArgs>(args: SelectSubset<T, CampaignFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CampaignClient<$Result.GetResult<Prisma.$CampaignPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Campaign that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CampaignFindFirstArgs} args - Arguments to find a Campaign
     * @example
     * // Get one Campaign
     * const campaign = await prisma.campaign.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CampaignFindFirstArgs>(args?: SelectSubset<T, CampaignFindFirstArgs<ExtArgs>>): Prisma__CampaignClient<$Result.GetResult<Prisma.$CampaignPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Campaign that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CampaignFindFirstOrThrowArgs} args - Arguments to find a Campaign
     * @example
     * // Get one Campaign
     * const campaign = await prisma.campaign.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CampaignFindFirstOrThrowArgs>(args?: SelectSubset<T, CampaignFindFirstOrThrowArgs<ExtArgs>>): Prisma__CampaignClient<$Result.GetResult<Prisma.$CampaignPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Campaigns that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CampaignFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Campaigns
     * const campaigns = await prisma.campaign.findMany()
     * 
     * // Get first 10 Campaigns
     * const campaigns = await prisma.campaign.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const campaignWithIdOnly = await prisma.campaign.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CampaignFindManyArgs>(args?: SelectSubset<T, CampaignFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CampaignPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Campaign.
     * @param {CampaignCreateArgs} args - Arguments to create a Campaign.
     * @example
     * // Create one Campaign
     * const Campaign = await prisma.campaign.create({
     *   data: {
     *     // ... data to create a Campaign
     *   }
     * })
     * 
     */
    create<T extends CampaignCreateArgs>(args: SelectSubset<T, CampaignCreateArgs<ExtArgs>>): Prisma__CampaignClient<$Result.GetResult<Prisma.$CampaignPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Campaigns.
     * @param {CampaignCreateManyArgs} args - Arguments to create many Campaigns.
     * @example
     * // Create many Campaigns
     * const campaign = await prisma.campaign.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CampaignCreateManyArgs>(args?: SelectSubset<T, CampaignCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Campaigns and returns the data saved in the database.
     * @param {CampaignCreateManyAndReturnArgs} args - Arguments to create many Campaigns.
     * @example
     * // Create many Campaigns
     * const campaign = await prisma.campaign.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Campaigns and only return the `id`
     * const campaignWithIdOnly = await prisma.campaign.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CampaignCreateManyAndReturnArgs>(args?: SelectSubset<T, CampaignCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CampaignPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Campaign.
     * @param {CampaignDeleteArgs} args - Arguments to delete one Campaign.
     * @example
     * // Delete one Campaign
     * const Campaign = await prisma.campaign.delete({
     *   where: {
     *     // ... filter to delete one Campaign
     *   }
     * })
     * 
     */
    delete<T extends CampaignDeleteArgs>(args: SelectSubset<T, CampaignDeleteArgs<ExtArgs>>): Prisma__CampaignClient<$Result.GetResult<Prisma.$CampaignPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Campaign.
     * @param {CampaignUpdateArgs} args - Arguments to update one Campaign.
     * @example
     * // Update one Campaign
     * const campaign = await prisma.campaign.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CampaignUpdateArgs>(args: SelectSubset<T, CampaignUpdateArgs<ExtArgs>>): Prisma__CampaignClient<$Result.GetResult<Prisma.$CampaignPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Campaigns.
     * @param {CampaignDeleteManyArgs} args - Arguments to filter Campaigns to delete.
     * @example
     * // Delete a few Campaigns
     * const { count } = await prisma.campaign.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CampaignDeleteManyArgs>(args?: SelectSubset<T, CampaignDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Campaigns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CampaignUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Campaigns
     * const campaign = await prisma.campaign.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CampaignUpdateManyArgs>(args: SelectSubset<T, CampaignUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Campaigns and returns the data updated in the database.
     * @param {CampaignUpdateManyAndReturnArgs} args - Arguments to update many Campaigns.
     * @example
     * // Update many Campaigns
     * const campaign = await prisma.campaign.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Campaigns and only return the `id`
     * const campaignWithIdOnly = await prisma.campaign.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CampaignUpdateManyAndReturnArgs>(args: SelectSubset<T, CampaignUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CampaignPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Campaign.
     * @param {CampaignUpsertArgs} args - Arguments to update or create a Campaign.
     * @example
     * // Update or create a Campaign
     * const campaign = await prisma.campaign.upsert({
     *   create: {
     *     // ... data to create a Campaign
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Campaign we want to update
     *   }
     * })
     */
    upsert<T extends CampaignUpsertArgs>(args: SelectSubset<T, CampaignUpsertArgs<ExtArgs>>): Prisma__CampaignClient<$Result.GetResult<Prisma.$CampaignPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Campaigns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CampaignCountArgs} args - Arguments to filter Campaigns to count.
     * @example
     * // Count the number of Campaigns
     * const count = await prisma.campaign.count({
     *   where: {
     *     // ... the filter for the Campaigns we want to count
     *   }
     * })
    **/
    count<T extends CampaignCountArgs>(
      args?: Subset<T, CampaignCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CampaignCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Campaign.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CampaignAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CampaignAggregateArgs>(args: Subset<T, CampaignAggregateArgs>): Prisma.PrismaPromise<GetCampaignAggregateType<T>>

    /**
     * Group by Campaign.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CampaignGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CampaignGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CampaignGroupByArgs['orderBy'] }
        : { orderBy?: CampaignGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CampaignGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCampaignGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Campaign model
   */
  readonly fields: CampaignFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Campaign.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CampaignClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    resume<T extends Campaign$resumeArgs<ExtArgs> = {}>(args?: Subset<T, Campaign$resumeArgs<ExtArgs>>): Prisma__ResumeClient<$Result.GetResult<Prisma.$ResumePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    user<T extends Campaign$userArgs<ExtArgs> = {}>(args?: Subset<T, Campaign$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    linkedinConfig<T extends Campaign$linkedinConfigArgs<ExtArgs> = {}>(args?: Subset<T, Campaign$linkedinConfigArgs<ExtArgs>>): Prisma__CampaignLinkedinClient<$Result.GetResult<Prisma.$CampaignLinkedinPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    infojobsConfig<T extends Campaign$infojobsConfigArgs<ExtArgs> = {}>(args?: Subset<T, Campaign$infojobsConfigArgs<ExtArgs>>): Prisma__CampaignInfojobsClient<$Result.GetResult<Prisma.$CampaignInfojobsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    jobApplications<T extends Campaign$jobApplicationsArgs<ExtArgs> = {}>(args?: Subset<T, Campaign$jobApplicationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JobApplicationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Campaign model
   */
  interface CampaignFieldRefs {
    readonly id: FieldRef<"Campaign", 'String'>
    readonly resumeId: FieldRef<"Campaign", 'String'>
    readonly userId: FieldRef<"Campaign", 'String'>
    readonly name: FieldRef<"Campaign", 'String'>
    readonly platform: FieldRef<"Campaign", 'Platform'>
    readonly status: FieldRef<"Campaign", 'String'>
    readonly dailyLimit: FieldRef<"Campaign", 'Int'>
    readonly createdAt: FieldRef<"Campaign", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Campaign findUnique
   */
  export type CampaignFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Campaign
     */
    select?: CampaignSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Campaign
     */
    omit?: CampaignOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CampaignInclude<ExtArgs> | null
    /**
     * Filter, which Campaign to fetch.
     */
    where: CampaignWhereUniqueInput
  }

  /**
   * Campaign findUniqueOrThrow
   */
  export type CampaignFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Campaign
     */
    select?: CampaignSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Campaign
     */
    omit?: CampaignOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CampaignInclude<ExtArgs> | null
    /**
     * Filter, which Campaign to fetch.
     */
    where: CampaignWhereUniqueInput
  }

  /**
   * Campaign findFirst
   */
  export type CampaignFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Campaign
     */
    select?: CampaignSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Campaign
     */
    omit?: CampaignOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CampaignInclude<ExtArgs> | null
    /**
     * Filter, which Campaign to fetch.
     */
    where?: CampaignWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Campaigns to fetch.
     */
    orderBy?: CampaignOrderByWithRelationInput | CampaignOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Campaigns.
     */
    cursor?: CampaignWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Campaigns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Campaigns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Campaigns.
     */
    distinct?: CampaignScalarFieldEnum | CampaignScalarFieldEnum[]
  }

  /**
   * Campaign findFirstOrThrow
   */
  export type CampaignFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Campaign
     */
    select?: CampaignSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Campaign
     */
    omit?: CampaignOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CampaignInclude<ExtArgs> | null
    /**
     * Filter, which Campaign to fetch.
     */
    where?: CampaignWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Campaigns to fetch.
     */
    orderBy?: CampaignOrderByWithRelationInput | CampaignOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Campaigns.
     */
    cursor?: CampaignWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Campaigns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Campaigns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Campaigns.
     */
    distinct?: CampaignScalarFieldEnum | CampaignScalarFieldEnum[]
  }

  /**
   * Campaign findMany
   */
  export type CampaignFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Campaign
     */
    select?: CampaignSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Campaign
     */
    omit?: CampaignOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CampaignInclude<ExtArgs> | null
    /**
     * Filter, which Campaigns to fetch.
     */
    where?: CampaignWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Campaigns to fetch.
     */
    orderBy?: CampaignOrderByWithRelationInput | CampaignOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Campaigns.
     */
    cursor?: CampaignWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Campaigns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Campaigns.
     */
    skip?: number
    distinct?: CampaignScalarFieldEnum | CampaignScalarFieldEnum[]
  }

  /**
   * Campaign create
   */
  export type CampaignCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Campaign
     */
    select?: CampaignSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Campaign
     */
    omit?: CampaignOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CampaignInclude<ExtArgs> | null
    /**
     * The data needed to create a Campaign.
     */
    data?: XOR<CampaignCreateInput, CampaignUncheckedCreateInput>
  }

  /**
   * Campaign createMany
   */
  export type CampaignCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Campaigns.
     */
    data: CampaignCreateManyInput | CampaignCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Campaign createManyAndReturn
   */
  export type CampaignCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Campaign
     */
    select?: CampaignSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Campaign
     */
    omit?: CampaignOmit<ExtArgs> | null
    /**
     * The data used to create many Campaigns.
     */
    data: CampaignCreateManyInput | CampaignCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CampaignIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Campaign update
   */
  export type CampaignUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Campaign
     */
    select?: CampaignSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Campaign
     */
    omit?: CampaignOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CampaignInclude<ExtArgs> | null
    /**
     * The data needed to update a Campaign.
     */
    data: XOR<CampaignUpdateInput, CampaignUncheckedUpdateInput>
    /**
     * Choose, which Campaign to update.
     */
    where: CampaignWhereUniqueInput
  }

  /**
   * Campaign updateMany
   */
  export type CampaignUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Campaigns.
     */
    data: XOR<CampaignUpdateManyMutationInput, CampaignUncheckedUpdateManyInput>
    /**
     * Filter which Campaigns to update
     */
    where?: CampaignWhereInput
    /**
     * Limit how many Campaigns to update.
     */
    limit?: number
  }

  /**
   * Campaign updateManyAndReturn
   */
  export type CampaignUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Campaign
     */
    select?: CampaignSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Campaign
     */
    omit?: CampaignOmit<ExtArgs> | null
    /**
     * The data used to update Campaigns.
     */
    data: XOR<CampaignUpdateManyMutationInput, CampaignUncheckedUpdateManyInput>
    /**
     * Filter which Campaigns to update
     */
    where?: CampaignWhereInput
    /**
     * Limit how many Campaigns to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CampaignIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Campaign upsert
   */
  export type CampaignUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Campaign
     */
    select?: CampaignSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Campaign
     */
    omit?: CampaignOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CampaignInclude<ExtArgs> | null
    /**
     * The filter to search for the Campaign to update in case it exists.
     */
    where: CampaignWhereUniqueInput
    /**
     * In case the Campaign found by the `where` argument doesn't exist, create a new Campaign with this data.
     */
    create: XOR<CampaignCreateInput, CampaignUncheckedCreateInput>
    /**
     * In case the Campaign was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CampaignUpdateInput, CampaignUncheckedUpdateInput>
  }

  /**
   * Campaign delete
   */
  export type CampaignDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Campaign
     */
    select?: CampaignSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Campaign
     */
    omit?: CampaignOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CampaignInclude<ExtArgs> | null
    /**
     * Filter which Campaign to delete.
     */
    where: CampaignWhereUniqueInput
  }

  /**
   * Campaign deleteMany
   */
  export type CampaignDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Campaigns to delete
     */
    where?: CampaignWhereInput
    /**
     * Limit how many Campaigns to delete.
     */
    limit?: number
  }

  /**
   * Campaign.resume
   */
  export type Campaign$resumeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resume
     */
    select?: ResumeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Resume
     */
    omit?: ResumeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeInclude<ExtArgs> | null
    where?: ResumeWhereInput
  }

  /**
   * Campaign.user
   */
  export type Campaign$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Campaign.linkedinConfig
   */
  export type Campaign$linkedinConfigArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CampaignLinkedin
     */
    select?: CampaignLinkedinSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CampaignLinkedin
     */
    omit?: CampaignLinkedinOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CampaignLinkedinInclude<ExtArgs> | null
    where?: CampaignLinkedinWhereInput
  }

  /**
   * Campaign.infojobsConfig
   */
  export type Campaign$infojobsConfigArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CampaignInfojobs
     */
    select?: CampaignInfojobsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CampaignInfojobs
     */
    omit?: CampaignInfojobsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CampaignInfojobsInclude<ExtArgs> | null
    where?: CampaignInfojobsWhereInput
  }

  /**
   * Campaign.jobApplications
   */
  export type Campaign$jobApplicationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobApplication
     */
    select?: JobApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JobApplication
     */
    omit?: JobApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobApplicationInclude<ExtArgs> | null
    where?: JobApplicationWhereInput
    orderBy?: JobApplicationOrderByWithRelationInput | JobApplicationOrderByWithRelationInput[]
    cursor?: JobApplicationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: JobApplicationScalarFieldEnum | JobApplicationScalarFieldEnum[]
  }

  /**
   * Campaign without action
   */
  export type CampaignDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Campaign
     */
    select?: CampaignSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Campaign
     */
    omit?: CampaignOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CampaignInclude<ExtArgs> | null
  }


  /**
   * Model CampaignLinkedin
   */

  export type AggregateCampaignLinkedin = {
    _count: CampaignLinkedinCountAggregateOutputType | null
    _min: CampaignLinkedinMinAggregateOutputType | null
    _max: CampaignLinkedinMaxAggregateOutputType | null
  }

  export type CampaignLinkedinMinAggregateOutputType = {
    id: string | null
    campaignId: string | null
    searchTerms: string | null
    locationTerm: string | null
    sortBy: $Enums.LinkedinSort | null
    datePosted: $Enums.LinkedinDate | null
  }

  export type CampaignLinkedinMaxAggregateOutputType = {
    id: string | null
    campaignId: string | null
    searchTerms: string | null
    locationTerm: string | null
    sortBy: $Enums.LinkedinSort | null
    datePosted: $Enums.LinkedinDate | null
  }

  export type CampaignLinkedinCountAggregateOutputType = {
    id: number
    campaignId: number
    searchTerms: number
    locationTerm: number
    sortBy: number
    datePosted: number
    expLevel: number
    jobType: number
    remoteFilter: number
    _all: number
  }


  export type CampaignLinkedinMinAggregateInputType = {
    id?: true
    campaignId?: true
    searchTerms?: true
    locationTerm?: true
    sortBy?: true
    datePosted?: true
  }

  export type CampaignLinkedinMaxAggregateInputType = {
    id?: true
    campaignId?: true
    searchTerms?: true
    locationTerm?: true
    sortBy?: true
    datePosted?: true
  }

  export type CampaignLinkedinCountAggregateInputType = {
    id?: true
    campaignId?: true
    searchTerms?: true
    locationTerm?: true
    sortBy?: true
    datePosted?: true
    expLevel?: true
    jobType?: true
    remoteFilter?: true
    _all?: true
  }

  export type CampaignLinkedinAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CampaignLinkedin to aggregate.
     */
    where?: CampaignLinkedinWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CampaignLinkedins to fetch.
     */
    orderBy?: CampaignLinkedinOrderByWithRelationInput | CampaignLinkedinOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CampaignLinkedinWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CampaignLinkedins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CampaignLinkedins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CampaignLinkedins
    **/
    _count?: true | CampaignLinkedinCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CampaignLinkedinMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CampaignLinkedinMaxAggregateInputType
  }

  export type GetCampaignLinkedinAggregateType<T extends CampaignLinkedinAggregateArgs> = {
        [P in keyof T & keyof AggregateCampaignLinkedin]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCampaignLinkedin[P]>
      : GetScalarType<T[P], AggregateCampaignLinkedin[P]>
  }




  export type CampaignLinkedinGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CampaignLinkedinWhereInput
    orderBy?: CampaignLinkedinOrderByWithAggregationInput | CampaignLinkedinOrderByWithAggregationInput[]
    by: CampaignLinkedinScalarFieldEnum[] | CampaignLinkedinScalarFieldEnum
    having?: CampaignLinkedinScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CampaignLinkedinCountAggregateInputType | true
    _min?: CampaignLinkedinMinAggregateInputType
    _max?: CampaignLinkedinMaxAggregateInputType
  }

  export type CampaignLinkedinGroupByOutputType = {
    id: string
    campaignId: string | null
    searchTerms: string | null
    locationTerm: string | null
    sortBy: $Enums.LinkedinSort | null
    datePosted: $Enums.LinkedinDate | null
    expLevel: $Enums.LinkedinExp[]
    jobType: $Enums.LinkedinJobType[]
    remoteFilter: $Enums.LinkedinRemote[]
    _count: CampaignLinkedinCountAggregateOutputType | null
    _min: CampaignLinkedinMinAggregateOutputType | null
    _max: CampaignLinkedinMaxAggregateOutputType | null
  }

  type GetCampaignLinkedinGroupByPayload<T extends CampaignLinkedinGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CampaignLinkedinGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CampaignLinkedinGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CampaignLinkedinGroupByOutputType[P]>
            : GetScalarType<T[P], CampaignLinkedinGroupByOutputType[P]>
        }
      >
    >


  export type CampaignLinkedinSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    campaignId?: boolean
    searchTerms?: boolean
    locationTerm?: boolean
    sortBy?: boolean
    datePosted?: boolean
    expLevel?: boolean
    jobType?: boolean
    remoteFilter?: boolean
    campaign?: boolean | CampaignLinkedin$campaignArgs<ExtArgs>
  }, ExtArgs["result"]["campaignLinkedin"]>

  export type CampaignLinkedinSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    campaignId?: boolean
    searchTerms?: boolean
    locationTerm?: boolean
    sortBy?: boolean
    datePosted?: boolean
    expLevel?: boolean
    jobType?: boolean
    remoteFilter?: boolean
    campaign?: boolean | CampaignLinkedin$campaignArgs<ExtArgs>
  }, ExtArgs["result"]["campaignLinkedin"]>

  export type CampaignLinkedinSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    campaignId?: boolean
    searchTerms?: boolean
    locationTerm?: boolean
    sortBy?: boolean
    datePosted?: boolean
    expLevel?: boolean
    jobType?: boolean
    remoteFilter?: boolean
    campaign?: boolean | CampaignLinkedin$campaignArgs<ExtArgs>
  }, ExtArgs["result"]["campaignLinkedin"]>

  export type CampaignLinkedinSelectScalar = {
    id?: boolean
    campaignId?: boolean
    searchTerms?: boolean
    locationTerm?: boolean
    sortBy?: boolean
    datePosted?: boolean
    expLevel?: boolean
    jobType?: boolean
    remoteFilter?: boolean
  }

  export type CampaignLinkedinOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "campaignId" | "searchTerms" | "locationTerm" | "sortBy" | "datePosted" | "expLevel" | "jobType" | "remoteFilter", ExtArgs["result"]["campaignLinkedin"]>
  export type CampaignLinkedinInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    campaign?: boolean | CampaignLinkedin$campaignArgs<ExtArgs>
  }
  export type CampaignLinkedinIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    campaign?: boolean | CampaignLinkedin$campaignArgs<ExtArgs>
  }
  export type CampaignLinkedinIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    campaign?: boolean | CampaignLinkedin$campaignArgs<ExtArgs>
  }

  export type $CampaignLinkedinPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CampaignLinkedin"
    objects: {
      campaign: Prisma.$CampaignPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      campaignId: string | null
      searchTerms: string | null
      locationTerm: string | null
      sortBy: $Enums.LinkedinSort | null
      datePosted: $Enums.LinkedinDate | null
      expLevel: $Enums.LinkedinExp[]
      jobType: $Enums.LinkedinJobType[]
      remoteFilter: $Enums.LinkedinRemote[]
    }, ExtArgs["result"]["campaignLinkedin"]>
    composites: {}
  }

  type CampaignLinkedinGetPayload<S extends boolean | null | undefined | CampaignLinkedinDefaultArgs> = $Result.GetResult<Prisma.$CampaignLinkedinPayload, S>

  type CampaignLinkedinCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CampaignLinkedinFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CampaignLinkedinCountAggregateInputType | true
    }

  export interface CampaignLinkedinDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CampaignLinkedin'], meta: { name: 'CampaignLinkedin' } }
    /**
     * Find zero or one CampaignLinkedin that matches the filter.
     * @param {CampaignLinkedinFindUniqueArgs} args - Arguments to find a CampaignLinkedin
     * @example
     * // Get one CampaignLinkedin
     * const campaignLinkedin = await prisma.campaignLinkedin.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CampaignLinkedinFindUniqueArgs>(args: SelectSubset<T, CampaignLinkedinFindUniqueArgs<ExtArgs>>): Prisma__CampaignLinkedinClient<$Result.GetResult<Prisma.$CampaignLinkedinPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CampaignLinkedin that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CampaignLinkedinFindUniqueOrThrowArgs} args - Arguments to find a CampaignLinkedin
     * @example
     * // Get one CampaignLinkedin
     * const campaignLinkedin = await prisma.campaignLinkedin.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CampaignLinkedinFindUniqueOrThrowArgs>(args: SelectSubset<T, CampaignLinkedinFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CampaignLinkedinClient<$Result.GetResult<Prisma.$CampaignLinkedinPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CampaignLinkedin that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CampaignLinkedinFindFirstArgs} args - Arguments to find a CampaignLinkedin
     * @example
     * // Get one CampaignLinkedin
     * const campaignLinkedin = await prisma.campaignLinkedin.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CampaignLinkedinFindFirstArgs>(args?: SelectSubset<T, CampaignLinkedinFindFirstArgs<ExtArgs>>): Prisma__CampaignLinkedinClient<$Result.GetResult<Prisma.$CampaignLinkedinPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CampaignLinkedin that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CampaignLinkedinFindFirstOrThrowArgs} args - Arguments to find a CampaignLinkedin
     * @example
     * // Get one CampaignLinkedin
     * const campaignLinkedin = await prisma.campaignLinkedin.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CampaignLinkedinFindFirstOrThrowArgs>(args?: SelectSubset<T, CampaignLinkedinFindFirstOrThrowArgs<ExtArgs>>): Prisma__CampaignLinkedinClient<$Result.GetResult<Prisma.$CampaignLinkedinPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CampaignLinkedins that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CampaignLinkedinFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CampaignLinkedins
     * const campaignLinkedins = await prisma.campaignLinkedin.findMany()
     * 
     * // Get first 10 CampaignLinkedins
     * const campaignLinkedins = await prisma.campaignLinkedin.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const campaignLinkedinWithIdOnly = await prisma.campaignLinkedin.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CampaignLinkedinFindManyArgs>(args?: SelectSubset<T, CampaignLinkedinFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CampaignLinkedinPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CampaignLinkedin.
     * @param {CampaignLinkedinCreateArgs} args - Arguments to create a CampaignLinkedin.
     * @example
     * // Create one CampaignLinkedin
     * const CampaignLinkedin = await prisma.campaignLinkedin.create({
     *   data: {
     *     // ... data to create a CampaignLinkedin
     *   }
     * })
     * 
     */
    create<T extends CampaignLinkedinCreateArgs>(args: SelectSubset<T, CampaignLinkedinCreateArgs<ExtArgs>>): Prisma__CampaignLinkedinClient<$Result.GetResult<Prisma.$CampaignLinkedinPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CampaignLinkedins.
     * @param {CampaignLinkedinCreateManyArgs} args - Arguments to create many CampaignLinkedins.
     * @example
     * // Create many CampaignLinkedins
     * const campaignLinkedin = await prisma.campaignLinkedin.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CampaignLinkedinCreateManyArgs>(args?: SelectSubset<T, CampaignLinkedinCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CampaignLinkedins and returns the data saved in the database.
     * @param {CampaignLinkedinCreateManyAndReturnArgs} args - Arguments to create many CampaignLinkedins.
     * @example
     * // Create many CampaignLinkedins
     * const campaignLinkedin = await prisma.campaignLinkedin.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CampaignLinkedins and only return the `id`
     * const campaignLinkedinWithIdOnly = await prisma.campaignLinkedin.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CampaignLinkedinCreateManyAndReturnArgs>(args?: SelectSubset<T, CampaignLinkedinCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CampaignLinkedinPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CampaignLinkedin.
     * @param {CampaignLinkedinDeleteArgs} args - Arguments to delete one CampaignLinkedin.
     * @example
     * // Delete one CampaignLinkedin
     * const CampaignLinkedin = await prisma.campaignLinkedin.delete({
     *   where: {
     *     // ... filter to delete one CampaignLinkedin
     *   }
     * })
     * 
     */
    delete<T extends CampaignLinkedinDeleteArgs>(args: SelectSubset<T, CampaignLinkedinDeleteArgs<ExtArgs>>): Prisma__CampaignLinkedinClient<$Result.GetResult<Prisma.$CampaignLinkedinPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CampaignLinkedin.
     * @param {CampaignLinkedinUpdateArgs} args - Arguments to update one CampaignLinkedin.
     * @example
     * // Update one CampaignLinkedin
     * const campaignLinkedin = await prisma.campaignLinkedin.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CampaignLinkedinUpdateArgs>(args: SelectSubset<T, CampaignLinkedinUpdateArgs<ExtArgs>>): Prisma__CampaignLinkedinClient<$Result.GetResult<Prisma.$CampaignLinkedinPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CampaignLinkedins.
     * @param {CampaignLinkedinDeleteManyArgs} args - Arguments to filter CampaignLinkedins to delete.
     * @example
     * // Delete a few CampaignLinkedins
     * const { count } = await prisma.campaignLinkedin.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CampaignLinkedinDeleteManyArgs>(args?: SelectSubset<T, CampaignLinkedinDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CampaignLinkedins.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CampaignLinkedinUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CampaignLinkedins
     * const campaignLinkedin = await prisma.campaignLinkedin.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CampaignLinkedinUpdateManyArgs>(args: SelectSubset<T, CampaignLinkedinUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CampaignLinkedins and returns the data updated in the database.
     * @param {CampaignLinkedinUpdateManyAndReturnArgs} args - Arguments to update many CampaignLinkedins.
     * @example
     * // Update many CampaignLinkedins
     * const campaignLinkedin = await prisma.campaignLinkedin.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CampaignLinkedins and only return the `id`
     * const campaignLinkedinWithIdOnly = await prisma.campaignLinkedin.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CampaignLinkedinUpdateManyAndReturnArgs>(args: SelectSubset<T, CampaignLinkedinUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CampaignLinkedinPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CampaignLinkedin.
     * @param {CampaignLinkedinUpsertArgs} args - Arguments to update or create a CampaignLinkedin.
     * @example
     * // Update or create a CampaignLinkedin
     * const campaignLinkedin = await prisma.campaignLinkedin.upsert({
     *   create: {
     *     // ... data to create a CampaignLinkedin
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CampaignLinkedin we want to update
     *   }
     * })
     */
    upsert<T extends CampaignLinkedinUpsertArgs>(args: SelectSubset<T, CampaignLinkedinUpsertArgs<ExtArgs>>): Prisma__CampaignLinkedinClient<$Result.GetResult<Prisma.$CampaignLinkedinPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CampaignLinkedins.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CampaignLinkedinCountArgs} args - Arguments to filter CampaignLinkedins to count.
     * @example
     * // Count the number of CampaignLinkedins
     * const count = await prisma.campaignLinkedin.count({
     *   where: {
     *     // ... the filter for the CampaignLinkedins we want to count
     *   }
     * })
    **/
    count<T extends CampaignLinkedinCountArgs>(
      args?: Subset<T, CampaignLinkedinCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CampaignLinkedinCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CampaignLinkedin.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CampaignLinkedinAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CampaignLinkedinAggregateArgs>(args: Subset<T, CampaignLinkedinAggregateArgs>): Prisma.PrismaPromise<GetCampaignLinkedinAggregateType<T>>

    /**
     * Group by CampaignLinkedin.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CampaignLinkedinGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CampaignLinkedinGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CampaignLinkedinGroupByArgs['orderBy'] }
        : { orderBy?: CampaignLinkedinGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CampaignLinkedinGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCampaignLinkedinGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CampaignLinkedin model
   */
  readonly fields: CampaignLinkedinFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CampaignLinkedin.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CampaignLinkedinClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    campaign<T extends CampaignLinkedin$campaignArgs<ExtArgs> = {}>(args?: Subset<T, CampaignLinkedin$campaignArgs<ExtArgs>>): Prisma__CampaignClient<$Result.GetResult<Prisma.$CampaignPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CampaignLinkedin model
   */
  interface CampaignLinkedinFieldRefs {
    readonly id: FieldRef<"CampaignLinkedin", 'String'>
    readonly campaignId: FieldRef<"CampaignLinkedin", 'String'>
    readonly searchTerms: FieldRef<"CampaignLinkedin", 'String'>
    readonly locationTerm: FieldRef<"CampaignLinkedin", 'String'>
    readonly sortBy: FieldRef<"CampaignLinkedin", 'LinkedinSort'>
    readonly datePosted: FieldRef<"CampaignLinkedin", 'LinkedinDate'>
    readonly expLevel: FieldRef<"CampaignLinkedin", 'LinkedinExp[]'>
    readonly jobType: FieldRef<"CampaignLinkedin", 'LinkedinJobType[]'>
    readonly remoteFilter: FieldRef<"CampaignLinkedin", 'LinkedinRemote[]'>
  }
    

  // Custom InputTypes
  /**
   * CampaignLinkedin findUnique
   */
  export type CampaignLinkedinFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CampaignLinkedin
     */
    select?: CampaignLinkedinSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CampaignLinkedin
     */
    omit?: CampaignLinkedinOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CampaignLinkedinInclude<ExtArgs> | null
    /**
     * Filter, which CampaignLinkedin to fetch.
     */
    where: CampaignLinkedinWhereUniqueInput
  }

  /**
   * CampaignLinkedin findUniqueOrThrow
   */
  export type CampaignLinkedinFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CampaignLinkedin
     */
    select?: CampaignLinkedinSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CampaignLinkedin
     */
    omit?: CampaignLinkedinOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CampaignLinkedinInclude<ExtArgs> | null
    /**
     * Filter, which CampaignLinkedin to fetch.
     */
    where: CampaignLinkedinWhereUniqueInput
  }

  /**
   * CampaignLinkedin findFirst
   */
  export type CampaignLinkedinFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CampaignLinkedin
     */
    select?: CampaignLinkedinSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CampaignLinkedin
     */
    omit?: CampaignLinkedinOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CampaignLinkedinInclude<ExtArgs> | null
    /**
     * Filter, which CampaignLinkedin to fetch.
     */
    where?: CampaignLinkedinWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CampaignLinkedins to fetch.
     */
    orderBy?: CampaignLinkedinOrderByWithRelationInput | CampaignLinkedinOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CampaignLinkedins.
     */
    cursor?: CampaignLinkedinWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CampaignLinkedins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CampaignLinkedins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CampaignLinkedins.
     */
    distinct?: CampaignLinkedinScalarFieldEnum | CampaignLinkedinScalarFieldEnum[]
  }

  /**
   * CampaignLinkedin findFirstOrThrow
   */
  export type CampaignLinkedinFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CampaignLinkedin
     */
    select?: CampaignLinkedinSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CampaignLinkedin
     */
    omit?: CampaignLinkedinOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CampaignLinkedinInclude<ExtArgs> | null
    /**
     * Filter, which CampaignLinkedin to fetch.
     */
    where?: CampaignLinkedinWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CampaignLinkedins to fetch.
     */
    orderBy?: CampaignLinkedinOrderByWithRelationInput | CampaignLinkedinOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CampaignLinkedins.
     */
    cursor?: CampaignLinkedinWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CampaignLinkedins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CampaignLinkedins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CampaignLinkedins.
     */
    distinct?: CampaignLinkedinScalarFieldEnum | CampaignLinkedinScalarFieldEnum[]
  }

  /**
   * CampaignLinkedin findMany
   */
  export type CampaignLinkedinFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CampaignLinkedin
     */
    select?: CampaignLinkedinSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CampaignLinkedin
     */
    omit?: CampaignLinkedinOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CampaignLinkedinInclude<ExtArgs> | null
    /**
     * Filter, which CampaignLinkedins to fetch.
     */
    where?: CampaignLinkedinWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CampaignLinkedins to fetch.
     */
    orderBy?: CampaignLinkedinOrderByWithRelationInput | CampaignLinkedinOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CampaignLinkedins.
     */
    cursor?: CampaignLinkedinWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CampaignLinkedins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CampaignLinkedins.
     */
    skip?: number
    distinct?: CampaignLinkedinScalarFieldEnum | CampaignLinkedinScalarFieldEnum[]
  }

  /**
   * CampaignLinkedin create
   */
  export type CampaignLinkedinCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CampaignLinkedin
     */
    select?: CampaignLinkedinSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CampaignLinkedin
     */
    omit?: CampaignLinkedinOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CampaignLinkedinInclude<ExtArgs> | null
    /**
     * The data needed to create a CampaignLinkedin.
     */
    data?: XOR<CampaignLinkedinCreateInput, CampaignLinkedinUncheckedCreateInput>
  }

  /**
   * CampaignLinkedin createMany
   */
  export type CampaignLinkedinCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CampaignLinkedins.
     */
    data: CampaignLinkedinCreateManyInput | CampaignLinkedinCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CampaignLinkedin createManyAndReturn
   */
  export type CampaignLinkedinCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CampaignLinkedin
     */
    select?: CampaignLinkedinSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CampaignLinkedin
     */
    omit?: CampaignLinkedinOmit<ExtArgs> | null
    /**
     * The data used to create many CampaignLinkedins.
     */
    data: CampaignLinkedinCreateManyInput | CampaignLinkedinCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CampaignLinkedinIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * CampaignLinkedin update
   */
  export type CampaignLinkedinUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CampaignLinkedin
     */
    select?: CampaignLinkedinSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CampaignLinkedin
     */
    omit?: CampaignLinkedinOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CampaignLinkedinInclude<ExtArgs> | null
    /**
     * The data needed to update a CampaignLinkedin.
     */
    data: XOR<CampaignLinkedinUpdateInput, CampaignLinkedinUncheckedUpdateInput>
    /**
     * Choose, which CampaignLinkedin to update.
     */
    where: CampaignLinkedinWhereUniqueInput
  }

  /**
   * CampaignLinkedin updateMany
   */
  export type CampaignLinkedinUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CampaignLinkedins.
     */
    data: XOR<CampaignLinkedinUpdateManyMutationInput, CampaignLinkedinUncheckedUpdateManyInput>
    /**
     * Filter which CampaignLinkedins to update
     */
    where?: CampaignLinkedinWhereInput
    /**
     * Limit how many CampaignLinkedins to update.
     */
    limit?: number
  }

  /**
   * CampaignLinkedin updateManyAndReturn
   */
  export type CampaignLinkedinUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CampaignLinkedin
     */
    select?: CampaignLinkedinSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CampaignLinkedin
     */
    omit?: CampaignLinkedinOmit<ExtArgs> | null
    /**
     * The data used to update CampaignLinkedins.
     */
    data: XOR<CampaignLinkedinUpdateManyMutationInput, CampaignLinkedinUncheckedUpdateManyInput>
    /**
     * Filter which CampaignLinkedins to update
     */
    where?: CampaignLinkedinWhereInput
    /**
     * Limit how many CampaignLinkedins to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CampaignLinkedinIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * CampaignLinkedin upsert
   */
  export type CampaignLinkedinUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CampaignLinkedin
     */
    select?: CampaignLinkedinSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CampaignLinkedin
     */
    omit?: CampaignLinkedinOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CampaignLinkedinInclude<ExtArgs> | null
    /**
     * The filter to search for the CampaignLinkedin to update in case it exists.
     */
    where: CampaignLinkedinWhereUniqueInput
    /**
     * In case the CampaignLinkedin found by the `where` argument doesn't exist, create a new CampaignLinkedin with this data.
     */
    create: XOR<CampaignLinkedinCreateInput, CampaignLinkedinUncheckedCreateInput>
    /**
     * In case the CampaignLinkedin was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CampaignLinkedinUpdateInput, CampaignLinkedinUncheckedUpdateInput>
  }

  /**
   * CampaignLinkedin delete
   */
  export type CampaignLinkedinDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CampaignLinkedin
     */
    select?: CampaignLinkedinSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CampaignLinkedin
     */
    omit?: CampaignLinkedinOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CampaignLinkedinInclude<ExtArgs> | null
    /**
     * Filter which CampaignLinkedin to delete.
     */
    where: CampaignLinkedinWhereUniqueInput
  }

  /**
   * CampaignLinkedin deleteMany
   */
  export type CampaignLinkedinDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CampaignLinkedins to delete
     */
    where?: CampaignLinkedinWhereInput
    /**
     * Limit how many CampaignLinkedins to delete.
     */
    limit?: number
  }

  /**
   * CampaignLinkedin.campaign
   */
  export type CampaignLinkedin$campaignArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Campaign
     */
    select?: CampaignSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Campaign
     */
    omit?: CampaignOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CampaignInclude<ExtArgs> | null
    where?: CampaignWhereInput
  }

  /**
   * CampaignLinkedin without action
   */
  export type CampaignLinkedinDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CampaignLinkedin
     */
    select?: CampaignLinkedinSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CampaignLinkedin
     */
    omit?: CampaignLinkedinOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CampaignLinkedinInclude<ExtArgs> | null
  }


  /**
   * Model CampaignInfojobs
   */

  export type AggregateCampaignInfojobs = {
    _count: CampaignInfojobsCountAggregateOutputType | null
    _min: CampaignInfojobsMinAggregateOutputType | null
    _max: CampaignInfojobsMaxAggregateOutputType | null
  }

  export type CampaignInfojobsMinAggregateOutputType = {
    id: string | null
    campaignId: string | null
    searchTerms: string | null
    locationState: $Enums.BrazilState | null
    kmDeVoce: $Enums.IjRadius | null
    salaryFilter: $Enums.IjSalary | null
    datePosted: $Enums.IjDatePosted | null
  }

  export type CampaignInfojobsMaxAggregateOutputType = {
    id: string | null
    campaignId: string | null
    searchTerms: string | null
    locationState: $Enums.BrazilState | null
    kmDeVoce: $Enums.IjRadius | null
    salaryFilter: $Enums.IjSalary | null
    datePosted: $Enums.IjDatePosted | null
  }

  export type CampaignInfojobsCountAggregateOutputType = {
    id: number
    campaignId: number
    searchTerms: number
    locationState: number
    kmDeVoce: number
    salaryFilter: number
    datePosted: number
    workModels: number
    jobAreas: number
    contractTypes: number
    workSchedules: number
    seniorityLevels: number
    pcdTypes: number
    _all: number
  }


  export type CampaignInfojobsMinAggregateInputType = {
    id?: true
    campaignId?: true
    searchTerms?: true
    locationState?: true
    kmDeVoce?: true
    salaryFilter?: true
    datePosted?: true
  }

  export type CampaignInfojobsMaxAggregateInputType = {
    id?: true
    campaignId?: true
    searchTerms?: true
    locationState?: true
    kmDeVoce?: true
    salaryFilter?: true
    datePosted?: true
  }

  export type CampaignInfojobsCountAggregateInputType = {
    id?: true
    campaignId?: true
    searchTerms?: true
    locationState?: true
    kmDeVoce?: true
    salaryFilter?: true
    datePosted?: true
    workModels?: true
    jobAreas?: true
    contractTypes?: true
    workSchedules?: true
    seniorityLevels?: true
    pcdTypes?: true
    _all?: true
  }

  export type CampaignInfojobsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CampaignInfojobs to aggregate.
     */
    where?: CampaignInfojobsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CampaignInfojobs to fetch.
     */
    orderBy?: CampaignInfojobsOrderByWithRelationInput | CampaignInfojobsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CampaignInfojobsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CampaignInfojobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CampaignInfojobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CampaignInfojobs
    **/
    _count?: true | CampaignInfojobsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CampaignInfojobsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CampaignInfojobsMaxAggregateInputType
  }

  export type GetCampaignInfojobsAggregateType<T extends CampaignInfojobsAggregateArgs> = {
        [P in keyof T & keyof AggregateCampaignInfojobs]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCampaignInfojobs[P]>
      : GetScalarType<T[P], AggregateCampaignInfojobs[P]>
  }




  export type CampaignInfojobsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CampaignInfojobsWhereInput
    orderBy?: CampaignInfojobsOrderByWithAggregationInput | CampaignInfojobsOrderByWithAggregationInput[]
    by: CampaignInfojobsScalarFieldEnum[] | CampaignInfojobsScalarFieldEnum
    having?: CampaignInfojobsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CampaignInfojobsCountAggregateInputType | true
    _min?: CampaignInfojobsMinAggregateInputType
    _max?: CampaignInfojobsMaxAggregateInputType
  }

  export type CampaignInfojobsGroupByOutputType = {
    id: string
    campaignId: string | null
    searchTerms: string | null
    locationState: $Enums.BrazilState | null
    kmDeVoce: $Enums.IjRadius | null
    salaryFilter: $Enums.IjSalary | null
    datePosted: $Enums.IjDatePosted | null
    workModels: $Enums.IjWorkModel[]
    jobAreas: $Enums.IjJobArea[]
    contractTypes: $Enums.IjContract[]
    workSchedules: $Enums.IjSchedule[]
    seniorityLevels: $Enums.IjSeniority[]
    pcdTypes: $Enums.IjPcd[]
    _count: CampaignInfojobsCountAggregateOutputType | null
    _min: CampaignInfojobsMinAggregateOutputType | null
    _max: CampaignInfojobsMaxAggregateOutputType | null
  }

  type GetCampaignInfojobsGroupByPayload<T extends CampaignInfojobsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CampaignInfojobsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CampaignInfojobsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CampaignInfojobsGroupByOutputType[P]>
            : GetScalarType<T[P], CampaignInfojobsGroupByOutputType[P]>
        }
      >
    >


  export type CampaignInfojobsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    campaignId?: boolean
    searchTerms?: boolean
    locationState?: boolean
    kmDeVoce?: boolean
    salaryFilter?: boolean
    datePosted?: boolean
    workModels?: boolean
    jobAreas?: boolean
    contractTypes?: boolean
    workSchedules?: boolean
    seniorityLevels?: boolean
    pcdTypes?: boolean
    campaign?: boolean | CampaignInfojobs$campaignArgs<ExtArgs>
  }, ExtArgs["result"]["campaignInfojobs"]>

  export type CampaignInfojobsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    campaignId?: boolean
    searchTerms?: boolean
    locationState?: boolean
    kmDeVoce?: boolean
    salaryFilter?: boolean
    datePosted?: boolean
    workModels?: boolean
    jobAreas?: boolean
    contractTypes?: boolean
    workSchedules?: boolean
    seniorityLevels?: boolean
    pcdTypes?: boolean
    campaign?: boolean | CampaignInfojobs$campaignArgs<ExtArgs>
  }, ExtArgs["result"]["campaignInfojobs"]>

  export type CampaignInfojobsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    campaignId?: boolean
    searchTerms?: boolean
    locationState?: boolean
    kmDeVoce?: boolean
    salaryFilter?: boolean
    datePosted?: boolean
    workModels?: boolean
    jobAreas?: boolean
    contractTypes?: boolean
    workSchedules?: boolean
    seniorityLevels?: boolean
    pcdTypes?: boolean
    campaign?: boolean | CampaignInfojobs$campaignArgs<ExtArgs>
  }, ExtArgs["result"]["campaignInfojobs"]>

  export type CampaignInfojobsSelectScalar = {
    id?: boolean
    campaignId?: boolean
    searchTerms?: boolean
    locationState?: boolean
    kmDeVoce?: boolean
    salaryFilter?: boolean
    datePosted?: boolean
    workModels?: boolean
    jobAreas?: boolean
    contractTypes?: boolean
    workSchedules?: boolean
    seniorityLevels?: boolean
    pcdTypes?: boolean
  }

  export type CampaignInfojobsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "campaignId" | "searchTerms" | "locationState" | "kmDeVoce" | "salaryFilter" | "datePosted" | "workModels" | "jobAreas" | "contractTypes" | "workSchedules" | "seniorityLevels" | "pcdTypes", ExtArgs["result"]["campaignInfojobs"]>
  export type CampaignInfojobsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    campaign?: boolean | CampaignInfojobs$campaignArgs<ExtArgs>
  }
  export type CampaignInfojobsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    campaign?: boolean | CampaignInfojobs$campaignArgs<ExtArgs>
  }
  export type CampaignInfojobsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    campaign?: boolean | CampaignInfojobs$campaignArgs<ExtArgs>
  }

  export type $CampaignInfojobsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CampaignInfojobs"
    objects: {
      campaign: Prisma.$CampaignPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      campaignId: string | null
      searchTerms: string | null
      locationState: $Enums.BrazilState | null
      kmDeVoce: $Enums.IjRadius | null
      salaryFilter: $Enums.IjSalary | null
      datePosted: $Enums.IjDatePosted | null
      workModels: $Enums.IjWorkModel[]
      jobAreas: $Enums.IjJobArea[]
      contractTypes: $Enums.IjContract[]
      workSchedules: $Enums.IjSchedule[]
      seniorityLevels: $Enums.IjSeniority[]
      pcdTypes: $Enums.IjPcd[]
    }, ExtArgs["result"]["campaignInfojobs"]>
    composites: {}
  }

  type CampaignInfojobsGetPayload<S extends boolean | null | undefined | CampaignInfojobsDefaultArgs> = $Result.GetResult<Prisma.$CampaignInfojobsPayload, S>

  type CampaignInfojobsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CampaignInfojobsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CampaignInfojobsCountAggregateInputType | true
    }

  export interface CampaignInfojobsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CampaignInfojobs'], meta: { name: 'CampaignInfojobs' } }
    /**
     * Find zero or one CampaignInfojobs that matches the filter.
     * @param {CampaignInfojobsFindUniqueArgs} args - Arguments to find a CampaignInfojobs
     * @example
     * // Get one CampaignInfojobs
     * const campaignInfojobs = await prisma.campaignInfojobs.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CampaignInfojobsFindUniqueArgs>(args: SelectSubset<T, CampaignInfojobsFindUniqueArgs<ExtArgs>>): Prisma__CampaignInfojobsClient<$Result.GetResult<Prisma.$CampaignInfojobsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CampaignInfojobs that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CampaignInfojobsFindUniqueOrThrowArgs} args - Arguments to find a CampaignInfojobs
     * @example
     * // Get one CampaignInfojobs
     * const campaignInfojobs = await prisma.campaignInfojobs.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CampaignInfojobsFindUniqueOrThrowArgs>(args: SelectSubset<T, CampaignInfojobsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CampaignInfojobsClient<$Result.GetResult<Prisma.$CampaignInfojobsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CampaignInfojobs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CampaignInfojobsFindFirstArgs} args - Arguments to find a CampaignInfojobs
     * @example
     * // Get one CampaignInfojobs
     * const campaignInfojobs = await prisma.campaignInfojobs.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CampaignInfojobsFindFirstArgs>(args?: SelectSubset<T, CampaignInfojobsFindFirstArgs<ExtArgs>>): Prisma__CampaignInfojobsClient<$Result.GetResult<Prisma.$CampaignInfojobsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CampaignInfojobs that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CampaignInfojobsFindFirstOrThrowArgs} args - Arguments to find a CampaignInfojobs
     * @example
     * // Get one CampaignInfojobs
     * const campaignInfojobs = await prisma.campaignInfojobs.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CampaignInfojobsFindFirstOrThrowArgs>(args?: SelectSubset<T, CampaignInfojobsFindFirstOrThrowArgs<ExtArgs>>): Prisma__CampaignInfojobsClient<$Result.GetResult<Prisma.$CampaignInfojobsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CampaignInfojobs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CampaignInfojobsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CampaignInfojobs
     * const campaignInfojobs = await prisma.campaignInfojobs.findMany()
     * 
     * // Get first 10 CampaignInfojobs
     * const campaignInfojobs = await prisma.campaignInfojobs.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const campaignInfojobsWithIdOnly = await prisma.campaignInfojobs.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CampaignInfojobsFindManyArgs>(args?: SelectSubset<T, CampaignInfojobsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CampaignInfojobsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CampaignInfojobs.
     * @param {CampaignInfojobsCreateArgs} args - Arguments to create a CampaignInfojobs.
     * @example
     * // Create one CampaignInfojobs
     * const CampaignInfojobs = await prisma.campaignInfojobs.create({
     *   data: {
     *     // ... data to create a CampaignInfojobs
     *   }
     * })
     * 
     */
    create<T extends CampaignInfojobsCreateArgs>(args: SelectSubset<T, CampaignInfojobsCreateArgs<ExtArgs>>): Prisma__CampaignInfojobsClient<$Result.GetResult<Prisma.$CampaignInfojobsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CampaignInfojobs.
     * @param {CampaignInfojobsCreateManyArgs} args - Arguments to create many CampaignInfojobs.
     * @example
     * // Create many CampaignInfojobs
     * const campaignInfojobs = await prisma.campaignInfojobs.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CampaignInfojobsCreateManyArgs>(args?: SelectSubset<T, CampaignInfojobsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CampaignInfojobs and returns the data saved in the database.
     * @param {CampaignInfojobsCreateManyAndReturnArgs} args - Arguments to create many CampaignInfojobs.
     * @example
     * // Create many CampaignInfojobs
     * const campaignInfojobs = await prisma.campaignInfojobs.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CampaignInfojobs and only return the `id`
     * const campaignInfojobsWithIdOnly = await prisma.campaignInfojobs.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CampaignInfojobsCreateManyAndReturnArgs>(args?: SelectSubset<T, CampaignInfojobsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CampaignInfojobsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CampaignInfojobs.
     * @param {CampaignInfojobsDeleteArgs} args - Arguments to delete one CampaignInfojobs.
     * @example
     * // Delete one CampaignInfojobs
     * const CampaignInfojobs = await prisma.campaignInfojobs.delete({
     *   where: {
     *     // ... filter to delete one CampaignInfojobs
     *   }
     * })
     * 
     */
    delete<T extends CampaignInfojobsDeleteArgs>(args: SelectSubset<T, CampaignInfojobsDeleteArgs<ExtArgs>>): Prisma__CampaignInfojobsClient<$Result.GetResult<Prisma.$CampaignInfojobsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CampaignInfojobs.
     * @param {CampaignInfojobsUpdateArgs} args - Arguments to update one CampaignInfojobs.
     * @example
     * // Update one CampaignInfojobs
     * const campaignInfojobs = await prisma.campaignInfojobs.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CampaignInfojobsUpdateArgs>(args: SelectSubset<T, CampaignInfojobsUpdateArgs<ExtArgs>>): Prisma__CampaignInfojobsClient<$Result.GetResult<Prisma.$CampaignInfojobsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CampaignInfojobs.
     * @param {CampaignInfojobsDeleteManyArgs} args - Arguments to filter CampaignInfojobs to delete.
     * @example
     * // Delete a few CampaignInfojobs
     * const { count } = await prisma.campaignInfojobs.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CampaignInfojobsDeleteManyArgs>(args?: SelectSubset<T, CampaignInfojobsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CampaignInfojobs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CampaignInfojobsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CampaignInfojobs
     * const campaignInfojobs = await prisma.campaignInfojobs.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CampaignInfojobsUpdateManyArgs>(args: SelectSubset<T, CampaignInfojobsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CampaignInfojobs and returns the data updated in the database.
     * @param {CampaignInfojobsUpdateManyAndReturnArgs} args - Arguments to update many CampaignInfojobs.
     * @example
     * // Update many CampaignInfojobs
     * const campaignInfojobs = await prisma.campaignInfojobs.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CampaignInfojobs and only return the `id`
     * const campaignInfojobsWithIdOnly = await prisma.campaignInfojobs.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CampaignInfojobsUpdateManyAndReturnArgs>(args: SelectSubset<T, CampaignInfojobsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CampaignInfojobsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CampaignInfojobs.
     * @param {CampaignInfojobsUpsertArgs} args - Arguments to update or create a CampaignInfojobs.
     * @example
     * // Update or create a CampaignInfojobs
     * const campaignInfojobs = await prisma.campaignInfojobs.upsert({
     *   create: {
     *     // ... data to create a CampaignInfojobs
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CampaignInfojobs we want to update
     *   }
     * })
     */
    upsert<T extends CampaignInfojobsUpsertArgs>(args: SelectSubset<T, CampaignInfojobsUpsertArgs<ExtArgs>>): Prisma__CampaignInfojobsClient<$Result.GetResult<Prisma.$CampaignInfojobsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CampaignInfojobs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CampaignInfojobsCountArgs} args - Arguments to filter CampaignInfojobs to count.
     * @example
     * // Count the number of CampaignInfojobs
     * const count = await prisma.campaignInfojobs.count({
     *   where: {
     *     // ... the filter for the CampaignInfojobs we want to count
     *   }
     * })
    **/
    count<T extends CampaignInfojobsCountArgs>(
      args?: Subset<T, CampaignInfojobsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CampaignInfojobsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CampaignInfojobs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CampaignInfojobsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CampaignInfojobsAggregateArgs>(args: Subset<T, CampaignInfojobsAggregateArgs>): Prisma.PrismaPromise<GetCampaignInfojobsAggregateType<T>>

    /**
     * Group by CampaignInfojobs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CampaignInfojobsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CampaignInfojobsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CampaignInfojobsGroupByArgs['orderBy'] }
        : { orderBy?: CampaignInfojobsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CampaignInfojobsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCampaignInfojobsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CampaignInfojobs model
   */
  readonly fields: CampaignInfojobsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CampaignInfojobs.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CampaignInfojobsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    campaign<T extends CampaignInfojobs$campaignArgs<ExtArgs> = {}>(args?: Subset<T, CampaignInfojobs$campaignArgs<ExtArgs>>): Prisma__CampaignClient<$Result.GetResult<Prisma.$CampaignPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CampaignInfojobs model
   */
  interface CampaignInfojobsFieldRefs {
    readonly id: FieldRef<"CampaignInfojobs", 'String'>
    readonly campaignId: FieldRef<"CampaignInfojobs", 'String'>
    readonly searchTerms: FieldRef<"CampaignInfojobs", 'String'>
    readonly locationState: FieldRef<"CampaignInfojobs", 'BrazilState'>
    readonly kmDeVoce: FieldRef<"CampaignInfojobs", 'IjRadius'>
    readonly salaryFilter: FieldRef<"CampaignInfojobs", 'IjSalary'>
    readonly datePosted: FieldRef<"CampaignInfojobs", 'IjDatePosted'>
    readonly workModels: FieldRef<"CampaignInfojobs", 'IjWorkModel[]'>
    readonly jobAreas: FieldRef<"CampaignInfojobs", 'IjJobArea[]'>
    readonly contractTypes: FieldRef<"CampaignInfojobs", 'IjContract[]'>
    readonly workSchedules: FieldRef<"CampaignInfojobs", 'IjSchedule[]'>
    readonly seniorityLevels: FieldRef<"CampaignInfojobs", 'IjSeniority[]'>
    readonly pcdTypes: FieldRef<"CampaignInfojobs", 'IjPcd[]'>
  }
    

  // Custom InputTypes
  /**
   * CampaignInfojobs findUnique
   */
  export type CampaignInfojobsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CampaignInfojobs
     */
    select?: CampaignInfojobsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CampaignInfojobs
     */
    omit?: CampaignInfojobsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CampaignInfojobsInclude<ExtArgs> | null
    /**
     * Filter, which CampaignInfojobs to fetch.
     */
    where: CampaignInfojobsWhereUniqueInput
  }

  /**
   * CampaignInfojobs findUniqueOrThrow
   */
  export type CampaignInfojobsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CampaignInfojobs
     */
    select?: CampaignInfojobsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CampaignInfojobs
     */
    omit?: CampaignInfojobsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CampaignInfojobsInclude<ExtArgs> | null
    /**
     * Filter, which CampaignInfojobs to fetch.
     */
    where: CampaignInfojobsWhereUniqueInput
  }

  /**
   * CampaignInfojobs findFirst
   */
  export type CampaignInfojobsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CampaignInfojobs
     */
    select?: CampaignInfojobsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CampaignInfojobs
     */
    omit?: CampaignInfojobsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CampaignInfojobsInclude<ExtArgs> | null
    /**
     * Filter, which CampaignInfojobs to fetch.
     */
    where?: CampaignInfojobsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CampaignInfojobs to fetch.
     */
    orderBy?: CampaignInfojobsOrderByWithRelationInput | CampaignInfojobsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CampaignInfojobs.
     */
    cursor?: CampaignInfojobsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CampaignInfojobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CampaignInfojobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CampaignInfojobs.
     */
    distinct?: CampaignInfojobsScalarFieldEnum | CampaignInfojobsScalarFieldEnum[]
  }

  /**
   * CampaignInfojobs findFirstOrThrow
   */
  export type CampaignInfojobsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CampaignInfojobs
     */
    select?: CampaignInfojobsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CampaignInfojobs
     */
    omit?: CampaignInfojobsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CampaignInfojobsInclude<ExtArgs> | null
    /**
     * Filter, which CampaignInfojobs to fetch.
     */
    where?: CampaignInfojobsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CampaignInfojobs to fetch.
     */
    orderBy?: CampaignInfojobsOrderByWithRelationInput | CampaignInfojobsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CampaignInfojobs.
     */
    cursor?: CampaignInfojobsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CampaignInfojobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CampaignInfojobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CampaignInfojobs.
     */
    distinct?: CampaignInfojobsScalarFieldEnum | CampaignInfojobsScalarFieldEnum[]
  }

  /**
   * CampaignInfojobs findMany
   */
  export type CampaignInfojobsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CampaignInfojobs
     */
    select?: CampaignInfojobsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CampaignInfojobs
     */
    omit?: CampaignInfojobsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CampaignInfojobsInclude<ExtArgs> | null
    /**
     * Filter, which CampaignInfojobs to fetch.
     */
    where?: CampaignInfojobsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CampaignInfojobs to fetch.
     */
    orderBy?: CampaignInfojobsOrderByWithRelationInput | CampaignInfojobsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CampaignInfojobs.
     */
    cursor?: CampaignInfojobsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CampaignInfojobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CampaignInfojobs.
     */
    skip?: number
    distinct?: CampaignInfojobsScalarFieldEnum | CampaignInfojobsScalarFieldEnum[]
  }

  /**
   * CampaignInfojobs create
   */
  export type CampaignInfojobsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CampaignInfojobs
     */
    select?: CampaignInfojobsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CampaignInfojobs
     */
    omit?: CampaignInfojobsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CampaignInfojobsInclude<ExtArgs> | null
    /**
     * The data needed to create a CampaignInfojobs.
     */
    data?: XOR<CampaignInfojobsCreateInput, CampaignInfojobsUncheckedCreateInput>
  }

  /**
   * CampaignInfojobs createMany
   */
  export type CampaignInfojobsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CampaignInfojobs.
     */
    data: CampaignInfojobsCreateManyInput | CampaignInfojobsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CampaignInfojobs createManyAndReturn
   */
  export type CampaignInfojobsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CampaignInfojobs
     */
    select?: CampaignInfojobsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CampaignInfojobs
     */
    omit?: CampaignInfojobsOmit<ExtArgs> | null
    /**
     * The data used to create many CampaignInfojobs.
     */
    data: CampaignInfojobsCreateManyInput | CampaignInfojobsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CampaignInfojobsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * CampaignInfojobs update
   */
  export type CampaignInfojobsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CampaignInfojobs
     */
    select?: CampaignInfojobsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CampaignInfojobs
     */
    omit?: CampaignInfojobsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CampaignInfojobsInclude<ExtArgs> | null
    /**
     * The data needed to update a CampaignInfojobs.
     */
    data: XOR<CampaignInfojobsUpdateInput, CampaignInfojobsUncheckedUpdateInput>
    /**
     * Choose, which CampaignInfojobs to update.
     */
    where: CampaignInfojobsWhereUniqueInput
  }

  /**
   * CampaignInfojobs updateMany
   */
  export type CampaignInfojobsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CampaignInfojobs.
     */
    data: XOR<CampaignInfojobsUpdateManyMutationInput, CampaignInfojobsUncheckedUpdateManyInput>
    /**
     * Filter which CampaignInfojobs to update
     */
    where?: CampaignInfojobsWhereInput
    /**
     * Limit how many CampaignInfojobs to update.
     */
    limit?: number
  }

  /**
   * CampaignInfojobs updateManyAndReturn
   */
  export type CampaignInfojobsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CampaignInfojobs
     */
    select?: CampaignInfojobsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CampaignInfojobs
     */
    omit?: CampaignInfojobsOmit<ExtArgs> | null
    /**
     * The data used to update CampaignInfojobs.
     */
    data: XOR<CampaignInfojobsUpdateManyMutationInput, CampaignInfojobsUncheckedUpdateManyInput>
    /**
     * Filter which CampaignInfojobs to update
     */
    where?: CampaignInfojobsWhereInput
    /**
     * Limit how many CampaignInfojobs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CampaignInfojobsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * CampaignInfojobs upsert
   */
  export type CampaignInfojobsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CampaignInfojobs
     */
    select?: CampaignInfojobsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CampaignInfojobs
     */
    omit?: CampaignInfojobsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CampaignInfojobsInclude<ExtArgs> | null
    /**
     * The filter to search for the CampaignInfojobs to update in case it exists.
     */
    where: CampaignInfojobsWhereUniqueInput
    /**
     * In case the CampaignInfojobs found by the `where` argument doesn't exist, create a new CampaignInfojobs with this data.
     */
    create: XOR<CampaignInfojobsCreateInput, CampaignInfojobsUncheckedCreateInput>
    /**
     * In case the CampaignInfojobs was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CampaignInfojobsUpdateInput, CampaignInfojobsUncheckedUpdateInput>
  }

  /**
   * CampaignInfojobs delete
   */
  export type CampaignInfojobsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CampaignInfojobs
     */
    select?: CampaignInfojobsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CampaignInfojobs
     */
    omit?: CampaignInfojobsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CampaignInfojobsInclude<ExtArgs> | null
    /**
     * Filter which CampaignInfojobs to delete.
     */
    where: CampaignInfojobsWhereUniqueInput
  }

  /**
   * CampaignInfojobs deleteMany
   */
  export type CampaignInfojobsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CampaignInfojobs to delete
     */
    where?: CampaignInfojobsWhereInput
    /**
     * Limit how many CampaignInfojobs to delete.
     */
    limit?: number
  }

  /**
   * CampaignInfojobs.campaign
   */
  export type CampaignInfojobs$campaignArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Campaign
     */
    select?: CampaignSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Campaign
     */
    omit?: CampaignOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CampaignInclude<ExtArgs> | null
    where?: CampaignWhereInput
  }

  /**
   * CampaignInfojobs without action
   */
  export type CampaignInfojobsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CampaignInfojobs
     */
    select?: CampaignInfojobsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CampaignInfojobs
     */
    omit?: CampaignInfojobsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CampaignInfojobsInclude<ExtArgs> | null
  }


  /**
   * Model JobApplication
   */

  export type AggregateJobApplication = {
    _count: JobApplicationCountAggregateOutputType | null
    _min: JobApplicationMinAggregateOutputType | null
    _max: JobApplicationMaxAggregateOutputType | null
  }

  export type JobApplicationMinAggregateOutputType = {
    id: string | null
    campaignId: string | null
    userId: string | null
    platform: $Enums.Platform | null
    companyName: string | null
    jobTitle: string | null
    jobUrl: string | null
    status: $Enums.AppStatus | null
    errorLog: string | null
    appliedAt: Date | null
    createdAt: Date | null
  }

  export type JobApplicationMaxAggregateOutputType = {
    id: string | null
    campaignId: string | null
    userId: string | null
    platform: $Enums.Platform | null
    companyName: string | null
    jobTitle: string | null
    jobUrl: string | null
    status: $Enums.AppStatus | null
    errorLog: string | null
    appliedAt: Date | null
    createdAt: Date | null
  }

  export type JobApplicationCountAggregateOutputType = {
    id: number
    campaignId: number
    userId: number
    platform: number
    companyName: number
    jobTitle: number
    jobUrl: number
    status: number
    errorLog: number
    appliedAt: number
    createdAt: number
    _all: number
  }


  export type JobApplicationMinAggregateInputType = {
    id?: true
    campaignId?: true
    userId?: true
    platform?: true
    companyName?: true
    jobTitle?: true
    jobUrl?: true
    status?: true
    errorLog?: true
    appliedAt?: true
    createdAt?: true
  }

  export type JobApplicationMaxAggregateInputType = {
    id?: true
    campaignId?: true
    userId?: true
    platform?: true
    companyName?: true
    jobTitle?: true
    jobUrl?: true
    status?: true
    errorLog?: true
    appliedAt?: true
    createdAt?: true
  }

  export type JobApplicationCountAggregateInputType = {
    id?: true
    campaignId?: true
    userId?: true
    platform?: true
    companyName?: true
    jobTitle?: true
    jobUrl?: true
    status?: true
    errorLog?: true
    appliedAt?: true
    createdAt?: true
    _all?: true
  }

  export type JobApplicationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which JobApplication to aggregate.
     */
    where?: JobApplicationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of JobApplications to fetch.
     */
    orderBy?: JobApplicationOrderByWithRelationInput | JobApplicationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: JobApplicationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` JobApplications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` JobApplications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned JobApplications
    **/
    _count?: true | JobApplicationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: JobApplicationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: JobApplicationMaxAggregateInputType
  }

  export type GetJobApplicationAggregateType<T extends JobApplicationAggregateArgs> = {
        [P in keyof T & keyof AggregateJobApplication]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateJobApplication[P]>
      : GetScalarType<T[P], AggregateJobApplication[P]>
  }




  export type JobApplicationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: JobApplicationWhereInput
    orderBy?: JobApplicationOrderByWithAggregationInput | JobApplicationOrderByWithAggregationInput[]
    by: JobApplicationScalarFieldEnum[] | JobApplicationScalarFieldEnum
    having?: JobApplicationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: JobApplicationCountAggregateInputType | true
    _min?: JobApplicationMinAggregateInputType
    _max?: JobApplicationMaxAggregateInputType
  }

  export type JobApplicationGroupByOutputType = {
    id: string
    campaignId: string | null
    userId: string | null
    platform: $Enums.Platform | null
    companyName: string | null
    jobTitle: string | null
    jobUrl: string | null
    status: $Enums.AppStatus | null
    errorLog: string | null
    appliedAt: Date | null
    createdAt: Date | null
    _count: JobApplicationCountAggregateOutputType | null
    _min: JobApplicationMinAggregateOutputType | null
    _max: JobApplicationMaxAggregateOutputType | null
  }

  type GetJobApplicationGroupByPayload<T extends JobApplicationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<JobApplicationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof JobApplicationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], JobApplicationGroupByOutputType[P]>
            : GetScalarType<T[P], JobApplicationGroupByOutputType[P]>
        }
      >
    >


  export type JobApplicationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    campaignId?: boolean
    userId?: boolean
    platform?: boolean
    companyName?: boolean
    jobTitle?: boolean
    jobUrl?: boolean
    status?: boolean
    errorLog?: boolean
    appliedAt?: boolean
    createdAt?: boolean
    campaign?: boolean | JobApplication$campaignArgs<ExtArgs>
    user?: boolean | JobApplication$userArgs<ExtArgs>
  }, ExtArgs["result"]["jobApplication"]>

  export type JobApplicationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    campaignId?: boolean
    userId?: boolean
    platform?: boolean
    companyName?: boolean
    jobTitle?: boolean
    jobUrl?: boolean
    status?: boolean
    errorLog?: boolean
    appliedAt?: boolean
    createdAt?: boolean
    campaign?: boolean | JobApplication$campaignArgs<ExtArgs>
    user?: boolean | JobApplication$userArgs<ExtArgs>
  }, ExtArgs["result"]["jobApplication"]>

  export type JobApplicationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    campaignId?: boolean
    userId?: boolean
    platform?: boolean
    companyName?: boolean
    jobTitle?: boolean
    jobUrl?: boolean
    status?: boolean
    errorLog?: boolean
    appliedAt?: boolean
    createdAt?: boolean
    campaign?: boolean | JobApplication$campaignArgs<ExtArgs>
    user?: boolean | JobApplication$userArgs<ExtArgs>
  }, ExtArgs["result"]["jobApplication"]>

  export type JobApplicationSelectScalar = {
    id?: boolean
    campaignId?: boolean
    userId?: boolean
    platform?: boolean
    companyName?: boolean
    jobTitle?: boolean
    jobUrl?: boolean
    status?: boolean
    errorLog?: boolean
    appliedAt?: boolean
    createdAt?: boolean
  }

  export type JobApplicationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "campaignId" | "userId" | "platform" | "companyName" | "jobTitle" | "jobUrl" | "status" | "errorLog" | "appliedAt" | "createdAt", ExtArgs["result"]["jobApplication"]>
  export type JobApplicationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    campaign?: boolean | JobApplication$campaignArgs<ExtArgs>
    user?: boolean | JobApplication$userArgs<ExtArgs>
  }
  export type JobApplicationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    campaign?: boolean | JobApplication$campaignArgs<ExtArgs>
    user?: boolean | JobApplication$userArgs<ExtArgs>
  }
  export type JobApplicationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    campaign?: boolean | JobApplication$campaignArgs<ExtArgs>
    user?: boolean | JobApplication$userArgs<ExtArgs>
  }

  export type $JobApplicationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "JobApplication"
    objects: {
      campaign: Prisma.$CampaignPayload<ExtArgs> | null
      user: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      campaignId: string | null
      userId: string | null
      platform: $Enums.Platform | null
      companyName: string | null
      jobTitle: string | null
      jobUrl: string | null
      status: $Enums.AppStatus | null
      errorLog: string | null
      appliedAt: Date | null
      createdAt: Date | null
    }, ExtArgs["result"]["jobApplication"]>
    composites: {}
  }

  type JobApplicationGetPayload<S extends boolean | null | undefined | JobApplicationDefaultArgs> = $Result.GetResult<Prisma.$JobApplicationPayload, S>

  type JobApplicationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<JobApplicationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: JobApplicationCountAggregateInputType | true
    }

  export interface JobApplicationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['JobApplication'], meta: { name: 'JobApplication' } }
    /**
     * Find zero or one JobApplication that matches the filter.
     * @param {JobApplicationFindUniqueArgs} args - Arguments to find a JobApplication
     * @example
     * // Get one JobApplication
     * const jobApplication = await prisma.jobApplication.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends JobApplicationFindUniqueArgs>(args: SelectSubset<T, JobApplicationFindUniqueArgs<ExtArgs>>): Prisma__JobApplicationClient<$Result.GetResult<Prisma.$JobApplicationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one JobApplication that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {JobApplicationFindUniqueOrThrowArgs} args - Arguments to find a JobApplication
     * @example
     * // Get one JobApplication
     * const jobApplication = await prisma.jobApplication.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends JobApplicationFindUniqueOrThrowArgs>(args: SelectSubset<T, JobApplicationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__JobApplicationClient<$Result.GetResult<Prisma.$JobApplicationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first JobApplication that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobApplicationFindFirstArgs} args - Arguments to find a JobApplication
     * @example
     * // Get one JobApplication
     * const jobApplication = await prisma.jobApplication.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends JobApplicationFindFirstArgs>(args?: SelectSubset<T, JobApplicationFindFirstArgs<ExtArgs>>): Prisma__JobApplicationClient<$Result.GetResult<Prisma.$JobApplicationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first JobApplication that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobApplicationFindFirstOrThrowArgs} args - Arguments to find a JobApplication
     * @example
     * // Get one JobApplication
     * const jobApplication = await prisma.jobApplication.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends JobApplicationFindFirstOrThrowArgs>(args?: SelectSubset<T, JobApplicationFindFirstOrThrowArgs<ExtArgs>>): Prisma__JobApplicationClient<$Result.GetResult<Prisma.$JobApplicationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more JobApplications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobApplicationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all JobApplications
     * const jobApplications = await prisma.jobApplication.findMany()
     * 
     * // Get first 10 JobApplications
     * const jobApplications = await prisma.jobApplication.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const jobApplicationWithIdOnly = await prisma.jobApplication.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends JobApplicationFindManyArgs>(args?: SelectSubset<T, JobApplicationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JobApplicationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a JobApplication.
     * @param {JobApplicationCreateArgs} args - Arguments to create a JobApplication.
     * @example
     * // Create one JobApplication
     * const JobApplication = await prisma.jobApplication.create({
     *   data: {
     *     // ... data to create a JobApplication
     *   }
     * })
     * 
     */
    create<T extends JobApplicationCreateArgs>(args: SelectSubset<T, JobApplicationCreateArgs<ExtArgs>>): Prisma__JobApplicationClient<$Result.GetResult<Prisma.$JobApplicationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many JobApplications.
     * @param {JobApplicationCreateManyArgs} args - Arguments to create many JobApplications.
     * @example
     * // Create many JobApplications
     * const jobApplication = await prisma.jobApplication.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends JobApplicationCreateManyArgs>(args?: SelectSubset<T, JobApplicationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many JobApplications and returns the data saved in the database.
     * @param {JobApplicationCreateManyAndReturnArgs} args - Arguments to create many JobApplications.
     * @example
     * // Create many JobApplications
     * const jobApplication = await prisma.jobApplication.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many JobApplications and only return the `id`
     * const jobApplicationWithIdOnly = await prisma.jobApplication.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends JobApplicationCreateManyAndReturnArgs>(args?: SelectSubset<T, JobApplicationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JobApplicationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a JobApplication.
     * @param {JobApplicationDeleteArgs} args - Arguments to delete one JobApplication.
     * @example
     * // Delete one JobApplication
     * const JobApplication = await prisma.jobApplication.delete({
     *   where: {
     *     // ... filter to delete one JobApplication
     *   }
     * })
     * 
     */
    delete<T extends JobApplicationDeleteArgs>(args: SelectSubset<T, JobApplicationDeleteArgs<ExtArgs>>): Prisma__JobApplicationClient<$Result.GetResult<Prisma.$JobApplicationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one JobApplication.
     * @param {JobApplicationUpdateArgs} args - Arguments to update one JobApplication.
     * @example
     * // Update one JobApplication
     * const jobApplication = await prisma.jobApplication.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends JobApplicationUpdateArgs>(args: SelectSubset<T, JobApplicationUpdateArgs<ExtArgs>>): Prisma__JobApplicationClient<$Result.GetResult<Prisma.$JobApplicationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more JobApplications.
     * @param {JobApplicationDeleteManyArgs} args - Arguments to filter JobApplications to delete.
     * @example
     * // Delete a few JobApplications
     * const { count } = await prisma.jobApplication.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends JobApplicationDeleteManyArgs>(args?: SelectSubset<T, JobApplicationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more JobApplications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobApplicationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many JobApplications
     * const jobApplication = await prisma.jobApplication.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends JobApplicationUpdateManyArgs>(args: SelectSubset<T, JobApplicationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more JobApplications and returns the data updated in the database.
     * @param {JobApplicationUpdateManyAndReturnArgs} args - Arguments to update many JobApplications.
     * @example
     * // Update many JobApplications
     * const jobApplication = await prisma.jobApplication.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more JobApplications and only return the `id`
     * const jobApplicationWithIdOnly = await prisma.jobApplication.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends JobApplicationUpdateManyAndReturnArgs>(args: SelectSubset<T, JobApplicationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JobApplicationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one JobApplication.
     * @param {JobApplicationUpsertArgs} args - Arguments to update or create a JobApplication.
     * @example
     * // Update or create a JobApplication
     * const jobApplication = await prisma.jobApplication.upsert({
     *   create: {
     *     // ... data to create a JobApplication
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the JobApplication we want to update
     *   }
     * })
     */
    upsert<T extends JobApplicationUpsertArgs>(args: SelectSubset<T, JobApplicationUpsertArgs<ExtArgs>>): Prisma__JobApplicationClient<$Result.GetResult<Prisma.$JobApplicationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of JobApplications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobApplicationCountArgs} args - Arguments to filter JobApplications to count.
     * @example
     * // Count the number of JobApplications
     * const count = await prisma.jobApplication.count({
     *   where: {
     *     // ... the filter for the JobApplications we want to count
     *   }
     * })
    **/
    count<T extends JobApplicationCountArgs>(
      args?: Subset<T, JobApplicationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], JobApplicationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a JobApplication.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobApplicationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends JobApplicationAggregateArgs>(args: Subset<T, JobApplicationAggregateArgs>): Prisma.PrismaPromise<GetJobApplicationAggregateType<T>>

    /**
     * Group by JobApplication.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobApplicationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends JobApplicationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: JobApplicationGroupByArgs['orderBy'] }
        : { orderBy?: JobApplicationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, JobApplicationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetJobApplicationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the JobApplication model
   */
  readonly fields: JobApplicationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for JobApplication.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__JobApplicationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    campaign<T extends JobApplication$campaignArgs<ExtArgs> = {}>(args?: Subset<T, JobApplication$campaignArgs<ExtArgs>>): Prisma__CampaignClient<$Result.GetResult<Prisma.$CampaignPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    user<T extends JobApplication$userArgs<ExtArgs> = {}>(args?: Subset<T, JobApplication$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the JobApplication model
   */
  interface JobApplicationFieldRefs {
    readonly id: FieldRef<"JobApplication", 'String'>
    readonly campaignId: FieldRef<"JobApplication", 'String'>
    readonly userId: FieldRef<"JobApplication", 'String'>
    readonly platform: FieldRef<"JobApplication", 'Platform'>
    readonly companyName: FieldRef<"JobApplication", 'String'>
    readonly jobTitle: FieldRef<"JobApplication", 'String'>
    readonly jobUrl: FieldRef<"JobApplication", 'String'>
    readonly status: FieldRef<"JobApplication", 'AppStatus'>
    readonly errorLog: FieldRef<"JobApplication", 'String'>
    readonly appliedAt: FieldRef<"JobApplication", 'DateTime'>
    readonly createdAt: FieldRef<"JobApplication", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * JobApplication findUnique
   */
  export type JobApplicationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobApplication
     */
    select?: JobApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JobApplication
     */
    omit?: JobApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobApplicationInclude<ExtArgs> | null
    /**
     * Filter, which JobApplication to fetch.
     */
    where: JobApplicationWhereUniqueInput
  }

  /**
   * JobApplication findUniqueOrThrow
   */
  export type JobApplicationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobApplication
     */
    select?: JobApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JobApplication
     */
    omit?: JobApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobApplicationInclude<ExtArgs> | null
    /**
     * Filter, which JobApplication to fetch.
     */
    where: JobApplicationWhereUniqueInput
  }

  /**
   * JobApplication findFirst
   */
  export type JobApplicationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobApplication
     */
    select?: JobApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JobApplication
     */
    omit?: JobApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobApplicationInclude<ExtArgs> | null
    /**
     * Filter, which JobApplication to fetch.
     */
    where?: JobApplicationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of JobApplications to fetch.
     */
    orderBy?: JobApplicationOrderByWithRelationInput | JobApplicationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for JobApplications.
     */
    cursor?: JobApplicationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` JobApplications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` JobApplications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of JobApplications.
     */
    distinct?: JobApplicationScalarFieldEnum | JobApplicationScalarFieldEnum[]
  }

  /**
   * JobApplication findFirstOrThrow
   */
  export type JobApplicationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobApplication
     */
    select?: JobApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JobApplication
     */
    omit?: JobApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobApplicationInclude<ExtArgs> | null
    /**
     * Filter, which JobApplication to fetch.
     */
    where?: JobApplicationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of JobApplications to fetch.
     */
    orderBy?: JobApplicationOrderByWithRelationInput | JobApplicationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for JobApplications.
     */
    cursor?: JobApplicationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` JobApplications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` JobApplications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of JobApplications.
     */
    distinct?: JobApplicationScalarFieldEnum | JobApplicationScalarFieldEnum[]
  }

  /**
   * JobApplication findMany
   */
  export type JobApplicationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobApplication
     */
    select?: JobApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JobApplication
     */
    omit?: JobApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobApplicationInclude<ExtArgs> | null
    /**
     * Filter, which JobApplications to fetch.
     */
    where?: JobApplicationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of JobApplications to fetch.
     */
    orderBy?: JobApplicationOrderByWithRelationInput | JobApplicationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing JobApplications.
     */
    cursor?: JobApplicationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` JobApplications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` JobApplications.
     */
    skip?: number
    distinct?: JobApplicationScalarFieldEnum | JobApplicationScalarFieldEnum[]
  }

  /**
   * JobApplication create
   */
  export type JobApplicationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobApplication
     */
    select?: JobApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JobApplication
     */
    omit?: JobApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobApplicationInclude<ExtArgs> | null
    /**
     * The data needed to create a JobApplication.
     */
    data?: XOR<JobApplicationCreateInput, JobApplicationUncheckedCreateInput>
  }

  /**
   * JobApplication createMany
   */
  export type JobApplicationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many JobApplications.
     */
    data: JobApplicationCreateManyInput | JobApplicationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * JobApplication createManyAndReturn
   */
  export type JobApplicationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobApplication
     */
    select?: JobApplicationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the JobApplication
     */
    omit?: JobApplicationOmit<ExtArgs> | null
    /**
     * The data used to create many JobApplications.
     */
    data: JobApplicationCreateManyInput | JobApplicationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobApplicationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * JobApplication update
   */
  export type JobApplicationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobApplication
     */
    select?: JobApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JobApplication
     */
    omit?: JobApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobApplicationInclude<ExtArgs> | null
    /**
     * The data needed to update a JobApplication.
     */
    data: XOR<JobApplicationUpdateInput, JobApplicationUncheckedUpdateInput>
    /**
     * Choose, which JobApplication to update.
     */
    where: JobApplicationWhereUniqueInput
  }

  /**
   * JobApplication updateMany
   */
  export type JobApplicationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update JobApplications.
     */
    data: XOR<JobApplicationUpdateManyMutationInput, JobApplicationUncheckedUpdateManyInput>
    /**
     * Filter which JobApplications to update
     */
    where?: JobApplicationWhereInput
    /**
     * Limit how many JobApplications to update.
     */
    limit?: number
  }

  /**
   * JobApplication updateManyAndReturn
   */
  export type JobApplicationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobApplication
     */
    select?: JobApplicationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the JobApplication
     */
    omit?: JobApplicationOmit<ExtArgs> | null
    /**
     * The data used to update JobApplications.
     */
    data: XOR<JobApplicationUpdateManyMutationInput, JobApplicationUncheckedUpdateManyInput>
    /**
     * Filter which JobApplications to update
     */
    where?: JobApplicationWhereInput
    /**
     * Limit how many JobApplications to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobApplicationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * JobApplication upsert
   */
  export type JobApplicationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobApplication
     */
    select?: JobApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JobApplication
     */
    omit?: JobApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobApplicationInclude<ExtArgs> | null
    /**
     * The filter to search for the JobApplication to update in case it exists.
     */
    where: JobApplicationWhereUniqueInput
    /**
     * In case the JobApplication found by the `where` argument doesn't exist, create a new JobApplication with this data.
     */
    create: XOR<JobApplicationCreateInput, JobApplicationUncheckedCreateInput>
    /**
     * In case the JobApplication was found with the provided `where` argument, update it with this data.
     */
    update: XOR<JobApplicationUpdateInput, JobApplicationUncheckedUpdateInput>
  }

  /**
   * JobApplication delete
   */
  export type JobApplicationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobApplication
     */
    select?: JobApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JobApplication
     */
    omit?: JobApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobApplicationInclude<ExtArgs> | null
    /**
     * Filter which JobApplication to delete.
     */
    where: JobApplicationWhereUniqueInput
  }

  /**
   * JobApplication deleteMany
   */
  export type JobApplicationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which JobApplications to delete
     */
    where?: JobApplicationWhereInput
    /**
     * Limit how many JobApplications to delete.
     */
    limit?: number
  }

  /**
   * JobApplication.campaign
   */
  export type JobApplication$campaignArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Campaign
     */
    select?: CampaignSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Campaign
     */
    omit?: CampaignOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CampaignInclude<ExtArgs> | null
    where?: CampaignWhereInput
  }

  /**
   * JobApplication.user
   */
  export type JobApplication$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * JobApplication without action
   */
  export type JobApplicationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobApplication
     */
    select?: JobApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the JobApplication
     */
    omit?: JobApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobApplicationInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    password: 'password',
    role: 'role',
    stripeCustomerId: 'stripeCustomerId',
    credits: 'credits',
    planTier: 'planTier',
    createdAt: 'createdAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const TransactionScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    amount: 'amount',
    type: 'type',
    reference_id: 'reference_id',
    description: 'description',
    created_at: 'created_at'
  };

  export type TransactionScalarFieldEnum = (typeof TransactionScalarFieldEnum)[keyof typeof TransactionScalarFieldEnum]


  export const ResumeScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    title: 'title',
    personalInfo: 'personalInfo',
    education: 'education',
    experience: 'experience',
    skills: 'skills',
    isDefault: 'isDefault',
    createdAt: 'createdAt'
  };

  export type ResumeScalarFieldEnum = (typeof ResumeScalarFieldEnum)[keyof typeof ResumeScalarFieldEnum]


  export const CampaignScalarFieldEnum: {
    id: 'id',
    resumeId: 'resumeId',
    userId: 'userId',
    name: 'name',
    platform: 'platform',
    status: 'status',
    dailyLimit: 'dailyLimit',
    createdAt: 'createdAt'
  };

  export type CampaignScalarFieldEnum = (typeof CampaignScalarFieldEnum)[keyof typeof CampaignScalarFieldEnum]


  export const CampaignLinkedinScalarFieldEnum: {
    id: 'id',
    campaignId: 'campaignId',
    searchTerms: 'searchTerms',
    locationTerm: 'locationTerm',
    sortBy: 'sortBy',
    datePosted: 'datePosted',
    expLevel: 'expLevel',
    jobType: 'jobType',
    remoteFilter: 'remoteFilter'
  };

  export type CampaignLinkedinScalarFieldEnum = (typeof CampaignLinkedinScalarFieldEnum)[keyof typeof CampaignLinkedinScalarFieldEnum]


  export const CampaignInfojobsScalarFieldEnum: {
    id: 'id',
    campaignId: 'campaignId',
    searchTerms: 'searchTerms',
    locationState: 'locationState',
    kmDeVoce: 'kmDeVoce',
    salaryFilter: 'salaryFilter',
    datePosted: 'datePosted',
    workModels: 'workModels',
    jobAreas: 'jobAreas',
    contractTypes: 'contractTypes',
    workSchedules: 'workSchedules',
    seniorityLevels: 'seniorityLevels',
    pcdTypes: 'pcdTypes'
  };

  export type CampaignInfojobsScalarFieldEnum = (typeof CampaignInfojobsScalarFieldEnum)[keyof typeof CampaignInfojobsScalarFieldEnum]


  export const JobApplicationScalarFieldEnum: {
    id: 'id',
    campaignId: 'campaignId',
    userId: 'userId',
    platform: 'platform',
    companyName: 'companyName',
    jobTitle: 'jobTitle',
    jobUrl: 'jobUrl',
    status: 'status',
    errorLog: 'errorLog',
    appliedAt: 'appliedAt',
    createdAt: 'createdAt'
  };

  export type JobApplicationScalarFieldEnum = (typeof JobApplicationScalarFieldEnum)[keyof typeof JobApplicationScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'UserRole'
   */
  export type EnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole'>
    


  /**
   * Reference to a field of type 'UserRole[]'
   */
  export type ListEnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'TransactionType'
   */
  export type EnumTransactionTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TransactionType'>
    


  /**
   * Reference to a field of type 'TransactionType[]'
   */
  export type ListEnumTransactionTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TransactionType[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Platform'
   */
  export type EnumPlatformFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Platform'>
    


  /**
   * Reference to a field of type 'Platform[]'
   */
  export type ListEnumPlatformFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Platform[]'>
    


  /**
   * Reference to a field of type 'LinkedinSort'
   */
  export type EnumLinkedinSortFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LinkedinSort'>
    


  /**
   * Reference to a field of type 'LinkedinSort[]'
   */
  export type ListEnumLinkedinSortFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LinkedinSort[]'>
    


  /**
   * Reference to a field of type 'LinkedinDate'
   */
  export type EnumLinkedinDateFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LinkedinDate'>
    


  /**
   * Reference to a field of type 'LinkedinDate[]'
   */
  export type ListEnumLinkedinDateFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LinkedinDate[]'>
    


  /**
   * Reference to a field of type 'LinkedinExp[]'
   */
  export type ListEnumLinkedinExpFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LinkedinExp[]'>
    


  /**
   * Reference to a field of type 'LinkedinExp'
   */
  export type EnumLinkedinExpFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LinkedinExp'>
    


  /**
   * Reference to a field of type 'LinkedinJobType[]'
   */
  export type ListEnumLinkedinJobTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LinkedinJobType[]'>
    


  /**
   * Reference to a field of type 'LinkedinJobType'
   */
  export type EnumLinkedinJobTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LinkedinJobType'>
    


  /**
   * Reference to a field of type 'LinkedinRemote[]'
   */
  export type ListEnumLinkedinRemoteFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LinkedinRemote[]'>
    


  /**
   * Reference to a field of type 'LinkedinRemote'
   */
  export type EnumLinkedinRemoteFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LinkedinRemote'>
    


  /**
   * Reference to a field of type 'BrazilState'
   */
  export type EnumBrazilStateFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BrazilState'>
    


  /**
   * Reference to a field of type 'BrazilState[]'
   */
  export type ListEnumBrazilStateFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BrazilState[]'>
    


  /**
   * Reference to a field of type 'IjRadius'
   */
  export type EnumIjRadiusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'IjRadius'>
    


  /**
   * Reference to a field of type 'IjRadius[]'
   */
  export type ListEnumIjRadiusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'IjRadius[]'>
    


  /**
   * Reference to a field of type 'IjSalary'
   */
  export type EnumIjSalaryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'IjSalary'>
    


  /**
   * Reference to a field of type 'IjSalary[]'
   */
  export type ListEnumIjSalaryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'IjSalary[]'>
    


  /**
   * Reference to a field of type 'IjDatePosted'
   */
  export type EnumIjDatePostedFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'IjDatePosted'>
    


  /**
   * Reference to a field of type 'IjDatePosted[]'
   */
  export type ListEnumIjDatePostedFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'IjDatePosted[]'>
    


  /**
   * Reference to a field of type 'IjWorkModel[]'
   */
  export type ListEnumIjWorkModelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'IjWorkModel[]'>
    


  /**
   * Reference to a field of type 'IjWorkModel'
   */
  export type EnumIjWorkModelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'IjWorkModel'>
    


  /**
   * Reference to a field of type 'IjJobArea[]'
   */
  export type ListEnumIjJobAreaFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'IjJobArea[]'>
    


  /**
   * Reference to a field of type 'IjJobArea'
   */
  export type EnumIjJobAreaFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'IjJobArea'>
    


  /**
   * Reference to a field of type 'IjContract[]'
   */
  export type ListEnumIjContractFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'IjContract[]'>
    


  /**
   * Reference to a field of type 'IjContract'
   */
  export type EnumIjContractFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'IjContract'>
    


  /**
   * Reference to a field of type 'IjSchedule[]'
   */
  export type ListEnumIjScheduleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'IjSchedule[]'>
    


  /**
   * Reference to a field of type 'IjSchedule'
   */
  export type EnumIjScheduleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'IjSchedule'>
    


  /**
   * Reference to a field of type 'IjSeniority[]'
   */
  export type ListEnumIjSeniorityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'IjSeniority[]'>
    


  /**
   * Reference to a field of type 'IjSeniority'
   */
  export type EnumIjSeniorityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'IjSeniority'>
    


  /**
   * Reference to a field of type 'IjPcd[]'
   */
  export type ListEnumIjPcdFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'IjPcd[]'>
    


  /**
   * Reference to a field of type 'IjPcd'
   */
  export type EnumIjPcdFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'IjPcd'>
    


  /**
   * Reference to a field of type 'AppStatus'
   */
  export type EnumAppStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AppStatus'>
    


  /**
   * Reference to a field of type 'AppStatus[]'
   */
  export type ListEnumAppStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AppStatus[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    password?: StringNullableFilter<"User"> | string | null
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    stripeCustomerId?: StringNullableFilter<"User"> | string | null
    credits?: IntNullableFilter<"User"> | number | null
    planTier?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeNullableFilter<"User"> | Date | string | null
    resumes?: ResumeListRelationFilter
    campaigns?: CampaignListRelationFilter
    jobApplications?: JobApplicationListRelationFilter
    transaction?: TransactionListRelationFilter
    stripeTransaction?: TransactionListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrderInput | SortOrder
    role?: SortOrder
    stripeCustomerId?: SortOrderInput | SortOrder
    credits?: SortOrderInput | SortOrder
    planTier?: SortOrderInput | SortOrder
    createdAt?: SortOrderInput | SortOrder
    resumes?: ResumeOrderByRelationAggregateInput
    campaigns?: CampaignOrderByRelationAggregateInput
    jobApplications?: JobApplicationOrderByRelationAggregateInput
    transaction?: TransactionOrderByRelationAggregateInput
    stripeTransaction?: TransactionOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    stripeCustomerId?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    password?: StringNullableFilter<"User"> | string | null
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    credits?: IntNullableFilter<"User"> | number | null
    planTier?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeNullableFilter<"User"> | Date | string | null
    resumes?: ResumeListRelationFilter
    campaigns?: CampaignListRelationFilter
    jobApplications?: JobApplicationListRelationFilter
    transaction?: TransactionListRelationFilter
    stripeTransaction?: TransactionListRelationFilter
  }, "id" | "email" | "stripeCustomerId">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrderInput | SortOrder
    role?: SortOrder
    stripeCustomerId?: SortOrderInput | SortOrder
    credits?: SortOrderInput | SortOrder
    planTier?: SortOrderInput | SortOrder
    createdAt?: SortOrderInput | SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    password?: StringNullableWithAggregatesFilter<"User"> | string | null
    role?: EnumUserRoleWithAggregatesFilter<"User"> | $Enums.UserRole
    stripeCustomerId?: StringNullableWithAggregatesFilter<"User"> | string | null
    credits?: IntNullableWithAggregatesFilter<"User"> | number | null
    planTier?: StringNullableWithAggregatesFilter<"User"> | string | null
    createdAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
  }

  export type TransactionWhereInput = {
    AND?: TransactionWhereInput | TransactionWhereInput[]
    OR?: TransactionWhereInput[]
    NOT?: TransactionWhereInput | TransactionWhereInput[]
    id?: UuidFilter<"Transaction"> | string
    userId?: StringNullableFilter<"Transaction"> | string | null
    amount?: IntNullableFilter<"Transaction"> | number | null
    type?: EnumTransactionTypeNullableFilter<"Transaction"> | $Enums.TransactionType | null
    reference_id?: StringNullableFilter<"Transaction"> | string | null
    description?: StringNullableFilter<"Transaction"> | string | null
    created_at?: DateTimeNullableFilter<"Transaction"> | Date | string | null
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    stripeCustomer?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }

  export type TransactionOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    amount?: SortOrderInput | SortOrder
    type?: SortOrderInput | SortOrder
    reference_id?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
    stripeCustomer?: UserOrderByWithRelationInput
  }

  export type TransactionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TransactionWhereInput | TransactionWhereInput[]
    OR?: TransactionWhereInput[]
    NOT?: TransactionWhereInput | TransactionWhereInput[]
    userId?: StringNullableFilter<"Transaction"> | string | null
    amount?: IntNullableFilter<"Transaction"> | number | null
    type?: EnumTransactionTypeNullableFilter<"Transaction"> | $Enums.TransactionType | null
    reference_id?: StringNullableFilter<"Transaction"> | string | null
    description?: StringNullableFilter<"Transaction"> | string | null
    created_at?: DateTimeNullableFilter<"Transaction"> | Date | string | null
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    stripeCustomer?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }, "id">

  export type TransactionOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    amount?: SortOrderInput | SortOrder
    type?: SortOrderInput | SortOrder
    reference_id?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    _count?: TransactionCountOrderByAggregateInput
    _avg?: TransactionAvgOrderByAggregateInput
    _max?: TransactionMaxOrderByAggregateInput
    _min?: TransactionMinOrderByAggregateInput
    _sum?: TransactionSumOrderByAggregateInput
  }

  export type TransactionScalarWhereWithAggregatesInput = {
    AND?: TransactionScalarWhereWithAggregatesInput | TransactionScalarWhereWithAggregatesInput[]
    OR?: TransactionScalarWhereWithAggregatesInput[]
    NOT?: TransactionScalarWhereWithAggregatesInput | TransactionScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Transaction"> | string
    userId?: StringNullableWithAggregatesFilter<"Transaction"> | string | null
    amount?: IntNullableWithAggregatesFilter<"Transaction"> | number | null
    type?: EnumTransactionTypeNullableWithAggregatesFilter<"Transaction"> | $Enums.TransactionType | null
    reference_id?: StringNullableWithAggregatesFilter<"Transaction"> | string | null
    description?: StringNullableWithAggregatesFilter<"Transaction"> | string | null
    created_at?: DateTimeNullableWithAggregatesFilter<"Transaction"> | Date | string | null
  }

  export type ResumeWhereInput = {
    AND?: ResumeWhereInput | ResumeWhereInput[]
    OR?: ResumeWhereInput[]
    NOT?: ResumeWhereInput | ResumeWhereInput[]
    id?: UuidFilter<"Resume"> | string
    userId?: StringNullableFilter<"Resume"> | string | null
    title?: StringNullableFilter<"Resume"> | string | null
    personalInfo?: JsonNullableFilter<"Resume">
    education?: JsonNullableFilter<"Resume">
    experience?: JsonNullableFilter<"Resume">
    skills?: JsonNullableFilter<"Resume">
    isDefault?: BoolNullableFilter<"Resume"> | boolean | null
    createdAt?: DateTimeNullableFilter<"Resume"> | Date | string | null
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    campaigns?: CampaignListRelationFilter
  }

  export type ResumeOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    title?: SortOrderInput | SortOrder
    personalInfo?: SortOrderInput | SortOrder
    education?: SortOrderInput | SortOrder
    experience?: SortOrderInput | SortOrder
    skills?: SortOrderInput | SortOrder
    isDefault?: SortOrderInput | SortOrder
    createdAt?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
    campaigns?: CampaignOrderByRelationAggregateInput
  }

  export type ResumeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ResumeWhereInput | ResumeWhereInput[]
    OR?: ResumeWhereInput[]
    NOT?: ResumeWhereInput | ResumeWhereInput[]
    userId?: StringNullableFilter<"Resume"> | string | null
    title?: StringNullableFilter<"Resume"> | string | null
    personalInfo?: JsonNullableFilter<"Resume">
    education?: JsonNullableFilter<"Resume">
    experience?: JsonNullableFilter<"Resume">
    skills?: JsonNullableFilter<"Resume">
    isDefault?: BoolNullableFilter<"Resume"> | boolean | null
    createdAt?: DateTimeNullableFilter<"Resume"> | Date | string | null
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    campaigns?: CampaignListRelationFilter
  }, "id">

  export type ResumeOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    title?: SortOrderInput | SortOrder
    personalInfo?: SortOrderInput | SortOrder
    education?: SortOrderInput | SortOrder
    experience?: SortOrderInput | SortOrder
    skills?: SortOrderInput | SortOrder
    isDefault?: SortOrderInput | SortOrder
    createdAt?: SortOrderInput | SortOrder
    _count?: ResumeCountOrderByAggregateInput
    _max?: ResumeMaxOrderByAggregateInput
    _min?: ResumeMinOrderByAggregateInput
  }

  export type ResumeScalarWhereWithAggregatesInput = {
    AND?: ResumeScalarWhereWithAggregatesInput | ResumeScalarWhereWithAggregatesInput[]
    OR?: ResumeScalarWhereWithAggregatesInput[]
    NOT?: ResumeScalarWhereWithAggregatesInput | ResumeScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Resume"> | string
    userId?: StringNullableWithAggregatesFilter<"Resume"> | string | null
    title?: StringNullableWithAggregatesFilter<"Resume"> | string | null
    personalInfo?: JsonNullableWithAggregatesFilter<"Resume">
    education?: JsonNullableWithAggregatesFilter<"Resume">
    experience?: JsonNullableWithAggregatesFilter<"Resume">
    skills?: JsonNullableWithAggregatesFilter<"Resume">
    isDefault?: BoolNullableWithAggregatesFilter<"Resume"> | boolean | null
    createdAt?: DateTimeNullableWithAggregatesFilter<"Resume"> | Date | string | null
  }

  export type CampaignWhereInput = {
    AND?: CampaignWhereInput | CampaignWhereInput[]
    OR?: CampaignWhereInput[]
    NOT?: CampaignWhereInput | CampaignWhereInput[]
    id?: UuidFilter<"Campaign"> | string
    resumeId?: UuidNullableFilter<"Campaign"> | string | null
    userId?: StringNullableFilter<"Campaign"> | string | null
    name?: StringNullableFilter<"Campaign"> | string | null
    platform?: EnumPlatformNullableFilter<"Campaign"> | $Enums.Platform | null
    status?: StringNullableFilter<"Campaign"> | string | null
    dailyLimit?: IntNullableFilter<"Campaign"> | number | null
    createdAt?: DateTimeNullableFilter<"Campaign"> | Date | string | null
    resume?: XOR<ResumeNullableScalarRelationFilter, ResumeWhereInput> | null
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    linkedinConfig?: XOR<CampaignLinkedinNullableScalarRelationFilter, CampaignLinkedinWhereInput> | null
    infojobsConfig?: XOR<CampaignInfojobsNullableScalarRelationFilter, CampaignInfojobsWhereInput> | null
    jobApplications?: JobApplicationListRelationFilter
  }

  export type CampaignOrderByWithRelationInput = {
    id?: SortOrder
    resumeId?: SortOrderInput | SortOrder
    userId?: SortOrderInput | SortOrder
    name?: SortOrderInput | SortOrder
    platform?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    dailyLimit?: SortOrderInput | SortOrder
    createdAt?: SortOrderInput | SortOrder
    resume?: ResumeOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
    linkedinConfig?: CampaignLinkedinOrderByWithRelationInput
    infojobsConfig?: CampaignInfojobsOrderByWithRelationInput
    jobApplications?: JobApplicationOrderByRelationAggregateInput
  }

  export type CampaignWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CampaignWhereInput | CampaignWhereInput[]
    OR?: CampaignWhereInput[]
    NOT?: CampaignWhereInput | CampaignWhereInput[]
    resumeId?: UuidNullableFilter<"Campaign"> | string | null
    userId?: StringNullableFilter<"Campaign"> | string | null
    name?: StringNullableFilter<"Campaign"> | string | null
    platform?: EnumPlatformNullableFilter<"Campaign"> | $Enums.Platform | null
    status?: StringNullableFilter<"Campaign"> | string | null
    dailyLimit?: IntNullableFilter<"Campaign"> | number | null
    createdAt?: DateTimeNullableFilter<"Campaign"> | Date | string | null
    resume?: XOR<ResumeNullableScalarRelationFilter, ResumeWhereInput> | null
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    linkedinConfig?: XOR<CampaignLinkedinNullableScalarRelationFilter, CampaignLinkedinWhereInput> | null
    infojobsConfig?: XOR<CampaignInfojobsNullableScalarRelationFilter, CampaignInfojobsWhereInput> | null
    jobApplications?: JobApplicationListRelationFilter
  }, "id">

  export type CampaignOrderByWithAggregationInput = {
    id?: SortOrder
    resumeId?: SortOrderInput | SortOrder
    userId?: SortOrderInput | SortOrder
    name?: SortOrderInput | SortOrder
    platform?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    dailyLimit?: SortOrderInput | SortOrder
    createdAt?: SortOrderInput | SortOrder
    _count?: CampaignCountOrderByAggregateInput
    _avg?: CampaignAvgOrderByAggregateInput
    _max?: CampaignMaxOrderByAggregateInput
    _min?: CampaignMinOrderByAggregateInput
    _sum?: CampaignSumOrderByAggregateInput
  }

  export type CampaignScalarWhereWithAggregatesInput = {
    AND?: CampaignScalarWhereWithAggregatesInput | CampaignScalarWhereWithAggregatesInput[]
    OR?: CampaignScalarWhereWithAggregatesInput[]
    NOT?: CampaignScalarWhereWithAggregatesInput | CampaignScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Campaign"> | string
    resumeId?: UuidNullableWithAggregatesFilter<"Campaign"> | string | null
    userId?: StringNullableWithAggregatesFilter<"Campaign"> | string | null
    name?: StringNullableWithAggregatesFilter<"Campaign"> | string | null
    platform?: EnumPlatformNullableWithAggregatesFilter<"Campaign"> | $Enums.Platform | null
    status?: StringNullableWithAggregatesFilter<"Campaign"> | string | null
    dailyLimit?: IntNullableWithAggregatesFilter<"Campaign"> | number | null
    createdAt?: DateTimeNullableWithAggregatesFilter<"Campaign"> | Date | string | null
  }

  export type CampaignLinkedinWhereInput = {
    AND?: CampaignLinkedinWhereInput | CampaignLinkedinWhereInput[]
    OR?: CampaignLinkedinWhereInput[]
    NOT?: CampaignLinkedinWhereInput | CampaignLinkedinWhereInput[]
    id?: UuidFilter<"CampaignLinkedin"> | string
    campaignId?: UuidNullableFilter<"CampaignLinkedin"> | string | null
    searchTerms?: StringNullableFilter<"CampaignLinkedin"> | string | null
    locationTerm?: StringNullableFilter<"CampaignLinkedin"> | string | null
    sortBy?: EnumLinkedinSortNullableFilter<"CampaignLinkedin"> | $Enums.LinkedinSort | null
    datePosted?: EnumLinkedinDateNullableFilter<"CampaignLinkedin"> | $Enums.LinkedinDate | null
    expLevel?: EnumLinkedinExpNullableListFilter<"CampaignLinkedin">
    jobType?: EnumLinkedinJobTypeNullableListFilter<"CampaignLinkedin">
    remoteFilter?: EnumLinkedinRemoteNullableListFilter<"CampaignLinkedin">
    campaign?: XOR<CampaignNullableScalarRelationFilter, CampaignWhereInput> | null
  }

  export type CampaignLinkedinOrderByWithRelationInput = {
    id?: SortOrder
    campaignId?: SortOrderInput | SortOrder
    searchTerms?: SortOrderInput | SortOrder
    locationTerm?: SortOrderInput | SortOrder
    sortBy?: SortOrderInput | SortOrder
    datePosted?: SortOrderInput | SortOrder
    expLevel?: SortOrder
    jobType?: SortOrder
    remoteFilter?: SortOrder
    campaign?: CampaignOrderByWithRelationInput
  }

  export type CampaignLinkedinWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    campaignId?: string
    AND?: CampaignLinkedinWhereInput | CampaignLinkedinWhereInput[]
    OR?: CampaignLinkedinWhereInput[]
    NOT?: CampaignLinkedinWhereInput | CampaignLinkedinWhereInput[]
    searchTerms?: StringNullableFilter<"CampaignLinkedin"> | string | null
    locationTerm?: StringNullableFilter<"CampaignLinkedin"> | string | null
    sortBy?: EnumLinkedinSortNullableFilter<"CampaignLinkedin"> | $Enums.LinkedinSort | null
    datePosted?: EnumLinkedinDateNullableFilter<"CampaignLinkedin"> | $Enums.LinkedinDate | null
    expLevel?: EnumLinkedinExpNullableListFilter<"CampaignLinkedin">
    jobType?: EnumLinkedinJobTypeNullableListFilter<"CampaignLinkedin">
    remoteFilter?: EnumLinkedinRemoteNullableListFilter<"CampaignLinkedin">
    campaign?: XOR<CampaignNullableScalarRelationFilter, CampaignWhereInput> | null
  }, "id" | "campaignId">

  export type CampaignLinkedinOrderByWithAggregationInput = {
    id?: SortOrder
    campaignId?: SortOrderInput | SortOrder
    searchTerms?: SortOrderInput | SortOrder
    locationTerm?: SortOrderInput | SortOrder
    sortBy?: SortOrderInput | SortOrder
    datePosted?: SortOrderInput | SortOrder
    expLevel?: SortOrder
    jobType?: SortOrder
    remoteFilter?: SortOrder
    _count?: CampaignLinkedinCountOrderByAggregateInput
    _max?: CampaignLinkedinMaxOrderByAggregateInput
    _min?: CampaignLinkedinMinOrderByAggregateInput
  }

  export type CampaignLinkedinScalarWhereWithAggregatesInput = {
    AND?: CampaignLinkedinScalarWhereWithAggregatesInput | CampaignLinkedinScalarWhereWithAggregatesInput[]
    OR?: CampaignLinkedinScalarWhereWithAggregatesInput[]
    NOT?: CampaignLinkedinScalarWhereWithAggregatesInput | CampaignLinkedinScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"CampaignLinkedin"> | string
    campaignId?: UuidNullableWithAggregatesFilter<"CampaignLinkedin"> | string | null
    searchTerms?: StringNullableWithAggregatesFilter<"CampaignLinkedin"> | string | null
    locationTerm?: StringNullableWithAggregatesFilter<"CampaignLinkedin"> | string | null
    sortBy?: EnumLinkedinSortNullableWithAggregatesFilter<"CampaignLinkedin"> | $Enums.LinkedinSort | null
    datePosted?: EnumLinkedinDateNullableWithAggregatesFilter<"CampaignLinkedin"> | $Enums.LinkedinDate | null
    expLevel?: EnumLinkedinExpNullableListFilter<"CampaignLinkedin">
    jobType?: EnumLinkedinJobTypeNullableListFilter<"CampaignLinkedin">
    remoteFilter?: EnumLinkedinRemoteNullableListFilter<"CampaignLinkedin">
  }

  export type CampaignInfojobsWhereInput = {
    AND?: CampaignInfojobsWhereInput | CampaignInfojobsWhereInput[]
    OR?: CampaignInfojobsWhereInput[]
    NOT?: CampaignInfojobsWhereInput | CampaignInfojobsWhereInput[]
    id?: UuidFilter<"CampaignInfojobs"> | string
    campaignId?: UuidNullableFilter<"CampaignInfojobs"> | string | null
    searchTerms?: StringNullableFilter<"CampaignInfojobs"> | string | null
    locationState?: EnumBrazilStateNullableFilter<"CampaignInfojobs"> | $Enums.BrazilState | null
    kmDeVoce?: EnumIjRadiusNullableFilter<"CampaignInfojobs"> | $Enums.IjRadius | null
    salaryFilter?: EnumIjSalaryNullableFilter<"CampaignInfojobs"> | $Enums.IjSalary | null
    datePosted?: EnumIjDatePostedNullableFilter<"CampaignInfojobs"> | $Enums.IjDatePosted | null
    workModels?: EnumIjWorkModelNullableListFilter<"CampaignInfojobs">
    jobAreas?: EnumIjJobAreaNullableListFilter<"CampaignInfojobs">
    contractTypes?: EnumIjContractNullableListFilter<"CampaignInfojobs">
    workSchedules?: EnumIjScheduleNullableListFilter<"CampaignInfojobs">
    seniorityLevels?: EnumIjSeniorityNullableListFilter<"CampaignInfojobs">
    pcdTypes?: EnumIjPcdNullableListFilter<"CampaignInfojobs">
    campaign?: XOR<CampaignNullableScalarRelationFilter, CampaignWhereInput> | null
  }

  export type CampaignInfojobsOrderByWithRelationInput = {
    id?: SortOrder
    campaignId?: SortOrderInput | SortOrder
    searchTerms?: SortOrderInput | SortOrder
    locationState?: SortOrderInput | SortOrder
    kmDeVoce?: SortOrderInput | SortOrder
    salaryFilter?: SortOrderInput | SortOrder
    datePosted?: SortOrderInput | SortOrder
    workModels?: SortOrder
    jobAreas?: SortOrder
    contractTypes?: SortOrder
    workSchedules?: SortOrder
    seniorityLevels?: SortOrder
    pcdTypes?: SortOrder
    campaign?: CampaignOrderByWithRelationInput
  }

  export type CampaignInfojobsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    campaignId?: string
    AND?: CampaignInfojobsWhereInput | CampaignInfojobsWhereInput[]
    OR?: CampaignInfojobsWhereInput[]
    NOT?: CampaignInfojobsWhereInput | CampaignInfojobsWhereInput[]
    searchTerms?: StringNullableFilter<"CampaignInfojobs"> | string | null
    locationState?: EnumBrazilStateNullableFilter<"CampaignInfojobs"> | $Enums.BrazilState | null
    kmDeVoce?: EnumIjRadiusNullableFilter<"CampaignInfojobs"> | $Enums.IjRadius | null
    salaryFilter?: EnumIjSalaryNullableFilter<"CampaignInfojobs"> | $Enums.IjSalary | null
    datePosted?: EnumIjDatePostedNullableFilter<"CampaignInfojobs"> | $Enums.IjDatePosted | null
    workModels?: EnumIjWorkModelNullableListFilter<"CampaignInfojobs">
    jobAreas?: EnumIjJobAreaNullableListFilter<"CampaignInfojobs">
    contractTypes?: EnumIjContractNullableListFilter<"CampaignInfojobs">
    workSchedules?: EnumIjScheduleNullableListFilter<"CampaignInfojobs">
    seniorityLevels?: EnumIjSeniorityNullableListFilter<"CampaignInfojobs">
    pcdTypes?: EnumIjPcdNullableListFilter<"CampaignInfojobs">
    campaign?: XOR<CampaignNullableScalarRelationFilter, CampaignWhereInput> | null
  }, "id" | "campaignId">

  export type CampaignInfojobsOrderByWithAggregationInput = {
    id?: SortOrder
    campaignId?: SortOrderInput | SortOrder
    searchTerms?: SortOrderInput | SortOrder
    locationState?: SortOrderInput | SortOrder
    kmDeVoce?: SortOrderInput | SortOrder
    salaryFilter?: SortOrderInput | SortOrder
    datePosted?: SortOrderInput | SortOrder
    workModels?: SortOrder
    jobAreas?: SortOrder
    contractTypes?: SortOrder
    workSchedules?: SortOrder
    seniorityLevels?: SortOrder
    pcdTypes?: SortOrder
    _count?: CampaignInfojobsCountOrderByAggregateInput
    _max?: CampaignInfojobsMaxOrderByAggregateInput
    _min?: CampaignInfojobsMinOrderByAggregateInput
  }

  export type CampaignInfojobsScalarWhereWithAggregatesInput = {
    AND?: CampaignInfojobsScalarWhereWithAggregatesInput | CampaignInfojobsScalarWhereWithAggregatesInput[]
    OR?: CampaignInfojobsScalarWhereWithAggregatesInput[]
    NOT?: CampaignInfojobsScalarWhereWithAggregatesInput | CampaignInfojobsScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"CampaignInfojobs"> | string
    campaignId?: UuidNullableWithAggregatesFilter<"CampaignInfojobs"> | string | null
    searchTerms?: StringNullableWithAggregatesFilter<"CampaignInfojobs"> | string | null
    locationState?: EnumBrazilStateNullableWithAggregatesFilter<"CampaignInfojobs"> | $Enums.BrazilState | null
    kmDeVoce?: EnumIjRadiusNullableWithAggregatesFilter<"CampaignInfojobs"> | $Enums.IjRadius | null
    salaryFilter?: EnumIjSalaryNullableWithAggregatesFilter<"CampaignInfojobs"> | $Enums.IjSalary | null
    datePosted?: EnumIjDatePostedNullableWithAggregatesFilter<"CampaignInfojobs"> | $Enums.IjDatePosted | null
    workModels?: EnumIjWorkModelNullableListFilter<"CampaignInfojobs">
    jobAreas?: EnumIjJobAreaNullableListFilter<"CampaignInfojobs">
    contractTypes?: EnumIjContractNullableListFilter<"CampaignInfojobs">
    workSchedules?: EnumIjScheduleNullableListFilter<"CampaignInfojobs">
    seniorityLevels?: EnumIjSeniorityNullableListFilter<"CampaignInfojobs">
    pcdTypes?: EnumIjPcdNullableListFilter<"CampaignInfojobs">
  }

  export type JobApplicationWhereInput = {
    AND?: JobApplicationWhereInput | JobApplicationWhereInput[]
    OR?: JobApplicationWhereInput[]
    NOT?: JobApplicationWhereInput | JobApplicationWhereInput[]
    id?: UuidFilter<"JobApplication"> | string
    campaignId?: UuidNullableFilter<"JobApplication"> | string | null
    userId?: StringNullableFilter<"JobApplication"> | string | null
    platform?: EnumPlatformNullableFilter<"JobApplication"> | $Enums.Platform | null
    companyName?: StringNullableFilter<"JobApplication"> | string | null
    jobTitle?: StringNullableFilter<"JobApplication"> | string | null
    jobUrl?: StringNullableFilter<"JobApplication"> | string | null
    status?: EnumAppStatusNullableFilter<"JobApplication"> | $Enums.AppStatus | null
    errorLog?: StringNullableFilter<"JobApplication"> | string | null
    appliedAt?: DateTimeNullableFilter<"JobApplication"> | Date | string | null
    createdAt?: DateTimeNullableFilter<"JobApplication"> | Date | string | null
    campaign?: XOR<CampaignNullableScalarRelationFilter, CampaignWhereInput> | null
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }

  export type JobApplicationOrderByWithRelationInput = {
    id?: SortOrder
    campaignId?: SortOrderInput | SortOrder
    userId?: SortOrderInput | SortOrder
    platform?: SortOrderInput | SortOrder
    companyName?: SortOrderInput | SortOrder
    jobTitle?: SortOrderInput | SortOrder
    jobUrl?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    errorLog?: SortOrderInput | SortOrder
    appliedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrderInput | SortOrder
    campaign?: CampaignOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
  }

  export type JobApplicationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    jobUrl?: string
    AND?: JobApplicationWhereInput | JobApplicationWhereInput[]
    OR?: JobApplicationWhereInput[]
    NOT?: JobApplicationWhereInput | JobApplicationWhereInput[]
    campaignId?: UuidNullableFilter<"JobApplication"> | string | null
    userId?: StringNullableFilter<"JobApplication"> | string | null
    platform?: EnumPlatformNullableFilter<"JobApplication"> | $Enums.Platform | null
    companyName?: StringNullableFilter<"JobApplication"> | string | null
    jobTitle?: StringNullableFilter<"JobApplication"> | string | null
    status?: EnumAppStatusNullableFilter<"JobApplication"> | $Enums.AppStatus | null
    errorLog?: StringNullableFilter<"JobApplication"> | string | null
    appliedAt?: DateTimeNullableFilter<"JobApplication"> | Date | string | null
    createdAt?: DateTimeNullableFilter<"JobApplication"> | Date | string | null
    campaign?: XOR<CampaignNullableScalarRelationFilter, CampaignWhereInput> | null
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }, "id" | "jobUrl">

  export type JobApplicationOrderByWithAggregationInput = {
    id?: SortOrder
    campaignId?: SortOrderInput | SortOrder
    userId?: SortOrderInput | SortOrder
    platform?: SortOrderInput | SortOrder
    companyName?: SortOrderInput | SortOrder
    jobTitle?: SortOrderInput | SortOrder
    jobUrl?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    errorLog?: SortOrderInput | SortOrder
    appliedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrderInput | SortOrder
    _count?: JobApplicationCountOrderByAggregateInput
    _max?: JobApplicationMaxOrderByAggregateInput
    _min?: JobApplicationMinOrderByAggregateInput
  }

  export type JobApplicationScalarWhereWithAggregatesInput = {
    AND?: JobApplicationScalarWhereWithAggregatesInput | JobApplicationScalarWhereWithAggregatesInput[]
    OR?: JobApplicationScalarWhereWithAggregatesInput[]
    NOT?: JobApplicationScalarWhereWithAggregatesInput | JobApplicationScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"JobApplication"> | string
    campaignId?: UuidNullableWithAggregatesFilter<"JobApplication"> | string | null
    userId?: StringNullableWithAggregatesFilter<"JobApplication"> | string | null
    platform?: EnumPlatformNullableWithAggregatesFilter<"JobApplication"> | $Enums.Platform | null
    companyName?: StringNullableWithAggregatesFilter<"JobApplication"> | string | null
    jobTitle?: StringNullableWithAggregatesFilter<"JobApplication"> | string | null
    jobUrl?: StringNullableWithAggregatesFilter<"JobApplication"> | string | null
    status?: EnumAppStatusNullableWithAggregatesFilter<"JobApplication"> | $Enums.AppStatus | null
    errorLog?: StringNullableWithAggregatesFilter<"JobApplication"> | string | null
    appliedAt?: DateTimeNullableWithAggregatesFilter<"JobApplication"> | Date | string | null
    createdAt?: DateTimeNullableWithAggregatesFilter<"JobApplication"> | Date | string | null
  }

  export type UserCreateInput = {
    id: string
    email: string
    password?: string | null
    role?: $Enums.UserRole
    stripeCustomerId?: string | null
    credits?: number | null
    planTier?: string | null
    createdAt?: Date | string | null
    resumes?: ResumeCreateNestedManyWithoutUserInput
    campaigns?: CampaignCreateNestedManyWithoutUserInput
    jobApplications?: JobApplicationCreateNestedManyWithoutUserInput
    transaction?: TransactionCreateNestedManyWithoutUserInput
    stripeTransaction?: TransactionCreateNestedManyWithoutStripeCustomerInput
  }

  export type UserUncheckedCreateInput = {
    id: string
    email: string
    password?: string | null
    role?: $Enums.UserRole
    stripeCustomerId?: string | null
    credits?: number | null
    planTier?: string | null
    createdAt?: Date | string | null
    resumes?: ResumeUncheckedCreateNestedManyWithoutUserInput
    campaigns?: CampaignUncheckedCreateNestedManyWithoutUserInput
    jobApplications?: JobApplicationUncheckedCreateNestedManyWithoutUserInput
    transaction?: TransactionUncheckedCreateNestedManyWithoutUserInput
    stripeTransaction?: TransactionUncheckedCreateNestedManyWithoutStripeCustomerInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    credits?: NullableIntFieldUpdateOperationsInput | number | null
    planTier?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resumes?: ResumeUpdateManyWithoutUserNestedInput
    campaigns?: CampaignUpdateManyWithoutUserNestedInput
    jobApplications?: JobApplicationUpdateManyWithoutUserNestedInput
    transaction?: TransactionUpdateManyWithoutUserNestedInput
    stripeTransaction?: TransactionUpdateManyWithoutStripeCustomerNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    credits?: NullableIntFieldUpdateOperationsInput | number | null
    planTier?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resumes?: ResumeUncheckedUpdateManyWithoutUserNestedInput
    campaigns?: CampaignUncheckedUpdateManyWithoutUserNestedInput
    jobApplications?: JobApplicationUncheckedUpdateManyWithoutUserNestedInput
    transaction?: TransactionUncheckedUpdateManyWithoutUserNestedInput
    stripeTransaction?: TransactionUncheckedUpdateManyWithoutStripeCustomerNestedInput
  }

  export type UserCreateManyInput = {
    id: string
    email: string
    password?: string | null
    role?: $Enums.UserRole
    stripeCustomerId?: string | null
    credits?: number | null
    planTier?: string | null
    createdAt?: Date | string | null
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    credits?: NullableIntFieldUpdateOperationsInput | number | null
    planTier?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    credits?: NullableIntFieldUpdateOperationsInput | number | null
    planTier?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TransactionCreateInput = {
    id?: string
    amount?: number | null
    type?: $Enums.TransactionType | null
    description?: string | null
    created_at?: Date | string | null
    user?: UserCreateNestedOneWithoutTransactionInput
    stripeCustomer?: UserCreateNestedOneWithoutStripeTransactionInput
  }

  export type TransactionUncheckedCreateInput = {
    id?: string
    userId?: string | null
    amount?: number | null
    type?: $Enums.TransactionType | null
    reference_id?: string | null
    description?: string | null
    created_at?: Date | string | null
  }

  export type TransactionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: NullableIntFieldUpdateOperationsInput | number | null
    type?: NullableEnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneWithoutTransactionNestedInput
    stripeCustomer?: UserUpdateOneWithoutStripeTransactionNestedInput
  }

  export type TransactionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: NullableIntFieldUpdateOperationsInput | number | null
    type?: NullableEnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType | null
    reference_id?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TransactionCreateManyInput = {
    id?: string
    userId?: string | null
    amount?: number | null
    type?: $Enums.TransactionType | null
    reference_id?: string | null
    description?: string | null
    created_at?: Date | string | null
  }

  export type TransactionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: NullableIntFieldUpdateOperationsInput | number | null
    type?: NullableEnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TransactionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: NullableIntFieldUpdateOperationsInput | number | null
    type?: NullableEnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType | null
    reference_id?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ResumeCreateInput = {
    id?: string
    title?: string | null
    personalInfo?: NullableJsonNullValueInput | InputJsonValue
    education?: NullableJsonNullValueInput | InputJsonValue
    experience?: NullableJsonNullValueInput | InputJsonValue
    skills?: NullableJsonNullValueInput | InputJsonValue
    isDefault?: boolean | null
    createdAt?: Date | string | null
    user?: UserCreateNestedOneWithoutResumesInput
    campaigns?: CampaignCreateNestedManyWithoutResumeInput
  }

  export type ResumeUncheckedCreateInput = {
    id?: string
    userId?: string | null
    title?: string | null
    personalInfo?: NullableJsonNullValueInput | InputJsonValue
    education?: NullableJsonNullValueInput | InputJsonValue
    experience?: NullableJsonNullValueInput | InputJsonValue
    skills?: NullableJsonNullValueInput | InputJsonValue
    isDefault?: boolean | null
    createdAt?: Date | string | null
    campaigns?: CampaignUncheckedCreateNestedManyWithoutResumeInput
  }

  export type ResumeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    personalInfo?: NullableJsonNullValueInput | InputJsonValue
    education?: NullableJsonNullValueInput | InputJsonValue
    experience?: NullableJsonNullValueInput | InputJsonValue
    skills?: NullableJsonNullValueInput | InputJsonValue
    isDefault?: NullableBoolFieldUpdateOperationsInput | boolean | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneWithoutResumesNestedInput
    campaigns?: CampaignUpdateManyWithoutResumeNestedInput
  }

  export type ResumeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: NullableStringFieldUpdateOperationsInput | string | null
    personalInfo?: NullableJsonNullValueInput | InputJsonValue
    education?: NullableJsonNullValueInput | InputJsonValue
    experience?: NullableJsonNullValueInput | InputJsonValue
    skills?: NullableJsonNullValueInput | InputJsonValue
    isDefault?: NullableBoolFieldUpdateOperationsInput | boolean | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    campaigns?: CampaignUncheckedUpdateManyWithoutResumeNestedInput
  }

  export type ResumeCreateManyInput = {
    id?: string
    userId?: string | null
    title?: string | null
    personalInfo?: NullableJsonNullValueInput | InputJsonValue
    education?: NullableJsonNullValueInput | InputJsonValue
    experience?: NullableJsonNullValueInput | InputJsonValue
    skills?: NullableJsonNullValueInput | InputJsonValue
    isDefault?: boolean | null
    createdAt?: Date | string | null
  }

  export type ResumeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    personalInfo?: NullableJsonNullValueInput | InputJsonValue
    education?: NullableJsonNullValueInput | InputJsonValue
    experience?: NullableJsonNullValueInput | InputJsonValue
    skills?: NullableJsonNullValueInput | InputJsonValue
    isDefault?: NullableBoolFieldUpdateOperationsInput | boolean | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ResumeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: NullableStringFieldUpdateOperationsInput | string | null
    personalInfo?: NullableJsonNullValueInput | InputJsonValue
    education?: NullableJsonNullValueInput | InputJsonValue
    experience?: NullableJsonNullValueInput | InputJsonValue
    skills?: NullableJsonNullValueInput | InputJsonValue
    isDefault?: NullableBoolFieldUpdateOperationsInput | boolean | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type CampaignCreateInput = {
    id?: string
    name?: string | null
    platform?: $Enums.Platform | null
    status?: string | null
    dailyLimit?: number | null
    createdAt?: Date | string | null
    resume?: ResumeCreateNestedOneWithoutCampaignsInput
    user?: UserCreateNestedOneWithoutCampaignsInput
    linkedinConfig?: CampaignLinkedinCreateNestedOneWithoutCampaignInput
    infojobsConfig?: CampaignInfojobsCreateNestedOneWithoutCampaignInput
    jobApplications?: JobApplicationCreateNestedManyWithoutCampaignInput
  }

  export type CampaignUncheckedCreateInput = {
    id?: string
    resumeId?: string | null
    userId?: string | null
    name?: string | null
    platform?: $Enums.Platform | null
    status?: string | null
    dailyLimit?: number | null
    createdAt?: Date | string | null
    linkedinConfig?: CampaignLinkedinUncheckedCreateNestedOneWithoutCampaignInput
    infojobsConfig?: CampaignInfojobsUncheckedCreateNestedOneWithoutCampaignInput
    jobApplications?: JobApplicationUncheckedCreateNestedManyWithoutCampaignInput
  }

  export type CampaignUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    platform?: NullableEnumPlatformFieldUpdateOperationsInput | $Enums.Platform | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    dailyLimit?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resume?: ResumeUpdateOneWithoutCampaignsNestedInput
    user?: UserUpdateOneWithoutCampaignsNestedInput
    linkedinConfig?: CampaignLinkedinUpdateOneWithoutCampaignNestedInput
    infojobsConfig?: CampaignInfojobsUpdateOneWithoutCampaignNestedInput
    jobApplications?: JobApplicationUpdateManyWithoutCampaignNestedInput
  }

  export type CampaignUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    resumeId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    platform?: NullableEnumPlatformFieldUpdateOperationsInput | $Enums.Platform | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    dailyLimit?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    linkedinConfig?: CampaignLinkedinUncheckedUpdateOneWithoutCampaignNestedInput
    infojobsConfig?: CampaignInfojobsUncheckedUpdateOneWithoutCampaignNestedInput
    jobApplications?: JobApplicationUncheckedUpdateManyWithoutCampaignNestedInput
  }

  export type CampaignCreateManyInput = {
    id?: string
    resumeId?: string | null
    userId?: string | null
    name?: string | null
    platform?: $Enums.Platform | null
    status?: string | null
    dailyLimit?: number | null
    createdAt?: Date | string | null
  }

  export type CampaignUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    platform?: NullableEnumPlatformFieldUpdateOperationsInput | $Enums.Platform | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    dailyLimit?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type CampaignUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    resumeId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    platform?: NullableEnumPlatformFieldUpdateOperationsInput | $Enums.Platform | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    dailyLimit?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type CampaignLinkedinCreateInput = {
    id?: string
    searchTerms?: string | null
    locationTerm?: string | null
    sortBy?: $Enums.LinkedinSort | null
    datePosted?: $Enums.LinkedinDate | null
    expLevel?: CampaignLinkedinCreateexpLevelInput | $Enums.LinkedinExp[]
    jobType?: CampaignLinkedinCreatejobTypeInput | $Enums.LinkedinJobType[]
    remoteFilter?: CampaignLinkedinCreateremoteFilterInput | $Enums.LinkedinRemote[]
    campaign?: CampaignCreateNestedOneWithoutLinkedinConfigInput
  }

  export type CampaignLinkedinUncheckedCreateInput = {
    id?: string
    campaignId?: string | null
    searchTerms?: string | null
    locationTerm?: string | null
    sortBy?: $Enums.LinkedinSort | null
    datePosted?: $Enums.LinkedinDate | null
    expLevel?: CampaignLinkedinCreateexpLevelInput | $Enums.LinkedinExp[]
    jobType?: CampaignLinkedinCreatejobTypeInput | $Enums.LinkedinJobType[]
    remoteFilter?: CampaignLinkedinCreateremoteFilterInput | $Enums.LinkedinRemote[]
  }

  export type CampaignLinkedinUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    searchTerms?: NullableStringFieldUpdateOperationsInput | string | null
    locationTerm?: NullableStringFieldUpdateOperationsInput | string | null
    sortBy?: NullableEnumLinkedinSortFieldUpdateOperationsInput | $Enums.LinkedinSort | null
    datePosted?: NullableEnumLinkedinDateFieldUpdateOperationsInput | $Enums.LinkedinDate | null
    expLevel?: CampaignLinkedinUpdateexpLevelInput | $Enums.LinkedinExp[]
    jobType?: CampaignLinkedinUpdatejobTypeInput | $Enums.LinkedinJobType[]
    remoteFilter?: CampaignLinkedinUpdateremoteFilterInput | $Enums.LinkedinRemote[]
    campaign?: CampaignUpdateOneWithoutLinkedinConfigNestedInput
  }

  export type CampaignLinkedinUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    campaignId?: NullableStringFieldUpdateOperationsInput | string | null
    searchTerms?: NullableStringFieldUpdateOperationsInput | string | null
    locationTerm?: NullableStringFieldUpdateOperationsInput | string | null
    sortBy?: NullableEnumLinkedinSortFieldUpdateOperationsInput | $Enums.LinkedinSort | null
    datePosted?: NullableEnumLinkedinDateFieldUpdateOperationsInput | $Enums.LinkedinDate | null
    expLevel?: CampaignLinkedinUpdateexpLevelInput | $Enums.LinkedinExp[]
    jobType?: CampaignLinkedinUpdatejobTypeInput | $Enums.LinkedinJobType[]
    remoteFilter?: CampaignLinkedinUpdateremoteFilterInput | $Enums.LinkedinRemote[]
  }

  export type CampaignLinkedinCreateManyInput = {
    id?: string
    campaignId?: string | null
    searchTerms?: string | null
    locationTerm?: string | null
    sortBy?: $Enums.LinkedinSort | null
    datePosted?: $Enums.LinkedinDate | null
    expLevel?: CampaignLinkedinCreateexpLevelInput | $Enums.LinkedinExp[]
    jobType?: CampaignLinkedinCreatejobTypeInput | $Enums.LinkedinJobType[]
    remoteFilter?: CampaignLinkedinCreateremoteFilterInput | $Enums.LinkedinRemote[]
  }

  export type CampaignLinkedinUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    searchTerms?: NullableStringFieldUpdateOperationsInput | string | null
    locationTerm?: NullableStringFieldUpdateOperationsInput | string | null
    sortBy?: NullableEnumLinkedinSortFieldUpdateOperationsInput | $Enums.LinkedinSort | null
    datePosted?: NullableEnumLinkedinDateFieldUpdateOperationsInput | $Enums.LinkedinDate | null
    expLevel?: CampaignLinkedinUpdateexpLevelInput | $Enums.LinkedinExp[]
    jobType?: CampaignLinkedinUpdatejobTypeInput | $Enums.LinkedinJobType[]
    remoteFilter?: CampaignLinkedinUpdateremoteFilterInput | $Enums.LinkedinRemote[]
  }

  export type CampaignLinkedinUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    campaignId?: NullableStringFieldUpdateOperationsInput | string | null
    searchTerms?: NullableStringFieldUpdateOperationsInput | string | null
    locationTerm?: NullableStringFieldUpdateOperationsInput | string | null
    sortBy?: NullableEnumLinkedinSortFieldUpdateOperationsInput | $Enums.LinkedinSort | null
    datePosted?: NullableEnumLinkedinDateFieldUpdateOperationsInput | $Enums.LinkedinDate | null
    expLevel?: CampaignLinkedinUpdateexpLevelInput | $Enums.LinkedinExp[]
    jobType?: CampaignLinkedinUpdatejobTypeInput | $Enums.LinkedinJobType[]
    remoteFilter?: CampaignLinkedinUpdateremoteFilterInput | $Enums.LinkedinRemote[]
  }

  export type CampaignInfojobsCreateInput = {
    id?: string
    searchTerms?: string | null
    locationState?: $Enums.BrazilState | null
    kmDeVoce?: $Enums.IjRadius | null
    salaryFilter?: $Enums.IjSalary | null
    datePosted?: $Enums.IjDatePosted | null
    workModels?: CampaignInfojobsCreateworkModelsInput | $Enums.IjWorkModel[]
    jobAreas?: CampaignInfojobsCreatejobAreasInput | $Enums.IjJobArea[]
    contractTypes?: CampaignInfojobsCreatecontractTypesInput | $Enums.IjContract[]
    workSchedules?: CampaignInfojobsCreateworkSchedulesInput | $Enums.IjSchedule[]
    seniorityLevels?: CampaignInfojobsCreateseniorityLevelsInput | $Enums.IjSeniority[]
    pcdTypes?: CampaignInfojobsCreatepcdTypesInput | $Enums.IjPcd[]
    campaign?: CampaignCreateNestedOneWithoutInfojobsConfigInput
  }

  export type CampaignInfojobsUncheckedCreateInput = {
    id?: string
    campaignId?: string | null
    searchTerms?: string | null
    locationState?: $Enums.BrazilState | null
    kmDeVoce?: $Enums.IjRadius | null
    salaryFilter?: $Enums.IjSalary | null
    datePosted?: $Enums.IjDatePosted | null
    workModels?: CampaignInfojobsCreateworkModelsInput | $Enums.IjWorkModel[]
    jobAreas?: CampaignInfojobsCreatejobAreasInput | $Enums.IjJobArea[]
    contractTypes?: CampaignInfojobsCreatecontractTypesInput | $Enums.IjContract[]
    workSchedules?: CampaignInfojobsCreateworkSchedulesInput | $Enums.IjSchedule[]
    seniorityLevels?: CampaignInfojobsCreateseniorityLevelsInput | $Enums.IjSeniority[]
    pcdTypes?: CampaignInfojobsCreatepcdTypesInput | $Enums.IjPcd[]
  }

  export type CampaignInfojobsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    searchTerms?: NullableStringFieldUpdateOperationsInput | string | null
    locationState?: NullableEnumBrazilStateFieldUpdateOperationsInput | $Enums.BrazilState | null
    kmDeVoce?: NullableEnumIjRadiusFieldUpdateOperationsInput | $Enums.IjRadius | null
    salaryFilter?: NullableEnumIjSalaryFieldUpdateOperationsInput | $Enums.IjSalary | null
    datePosted?: NullableEnumIjDatePostedFieldUpdateOperationsInput | $Enums.IjDatePosted | null
    workModels?: CampaignInfojobsUpdateworkModelsInput | $Enums.IjWorkModel[]
    jobAreas?: CampaignInfojobsUpdatejobAreasInput | $Enums.IjJobArea[]
    contractTypes?: CampaignInfojobsUpdatecontractTypesInput | $Enums.IjContract[]
    workSchedules?: CampaignInfojobsUpdateworkSchedulesInput | $Enums.IjSchedule[]
    seniorityLevels?: CampaignInfojobsUpdateseniorityLevelsInput | $Enums.IjSeniority[]
    pcdTypes?: CampaignInfojobsUpdatepcdTypesInput | $Enums.IjPcd[]
    campaign?: CampaignUpdateOneWithoutInfojobsConfigNestedInput
  }

  export type CampaignInfojobsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    campaignId?: NullableStringFieldUpdateOperationsInput | string | null
    searchTerms?: NullableStringFieldUpdateOperationsInput | string | null
    locationState?: NullableEnumBrazilStateFieldUpdateOperationsInput | $Enums.BrazilState | null
    kmDeVoce?: NullableEnumIjRadiusFieldUpdateOperationsInput | $Enums.IjRadius | null
    salaryFilter?: NullableEnumIjSalaryFieldUpdateOperationsInput | $Enums.IjSalary | null
    datePosted?: NullableEnumIjDatePostedFieldUpdateOperationsInput | $Enums.IjDatePosted | null
    workModels?: CampaignInfojobsUpdateworkModelsInput | $Enums.IjWorkModel[]
    jobAreas?: CampaignInfojobsUpdatejobAreasInput | $Enums.IjJobArea[]
    contractTypes?: CampaignInfojobsUpdatecontractTypesInput | $Enums.IjContract[]
    workSchedules?: CampaignInfojobsUpdateworkSchedulesInput | $Enums.IjSchedule[]
    seniorityLevels?: CampaignInfojobsUpdateseniorityLevelsInput | $Enums.IjSeniority[]
    pcdTypes?: CampaignInfojobsUpdatepcdTypesInput | $Enums.IjPcd[]
  }

  export type CampaignInfojobsCreateManyInput = {
    id?: string
    campaignId?: string | null
    searchTerms?: string | null
    locationState?: $Enums.BrazilState | null
    kmDeVoce?: $Enums.IjRadius | null
    salaryFilter?: $Enums.IjSalary | null
    datePosted?: $Enums.IjDatePosted | null
    workModels?: CampaignInfojobsCreateworkModelsInput | $Enums.IjWorkModel[]
    jobAreas?: CampaignInfojobsCreatejobAreasInput | $Enums.IjJobArea[]
    contractTypes?: CampaignInfojobsCreatecontractTypesInput | $Enums.IjContract[]
    workSchedules?: CampaignInfojobsCreateworkSchedulesInput | $Enums.IjSchedule[]
    seniorityLevels?: CampaignInfojobsCreateseniorityLevelsInput | $Enums.IjSeniority[]
    pcdTypes?: CampaignInfojobsCreatepcdTypesInput | $Enums.IjPcd[]
  }

  export type CampaignInfojobsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    searchTerms?: NullableStringFieldUpdateOperationsInput | string | null
    locationState?: NullableEnumBrazilStateFieldUpdateOperationsInput | $Enums.BrazilState | null
    kmDeVoce?: NullableEnumIjRadiusFieldUpdateOperationsInput | $Enums.IjRadius | null
    salaryFilter?: NullableEnumIjSalaryFieldUpdateOperationsInput | $Enums.IjSalary | null
    datePosted?: NullableEnumIjDatePostedFieldUpdateOperationsInput | $Enums.IjDatePosted | null
    workModels?: CampaignInfojobsUpdateworkModelsInput | $Enums.IjWorkModel[]
    jobAreas?: CampaignInfojobsUpdatejobAreasInput | $Enums.IjJobArea[]
    contractTypes?: CampaignInfojobsUpdatecontractTypesInput | $Enums.IjContract[]
    workSchedules?: CampaignInfojobsUpdateworkSchedulesInput | $Enums.IjSchedule[]
    seniorityLevels?: CampaignInfojobsUpdateseniorityLevelsInput | $Enums.IjSeniority[]
    pcdTypes?: CampaignInfojobsUpdatepcdTypesInput | $Enums.IjPcd[]
  }

  export type CampaignInfojobsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    campaignId?: NullableStringFieldUpdateOperationsInput | string | null
    searchTerms?: NullableStringFieldUpdateOperationsInput | string | null
    locationState?: NullableEnumBrazilStateFieldUpdateOperationsInput | $Enums.BrazilState | null
    kmDeVoce?: NullableEnumIjRadiusFieldUpdateOperationsInput | $Enums.IjRadius | null
    salaryFilter?: NullableEnumIjSalaryFieldUpdateOperationsInput | $Enums.IjSalary | null
    datePosted?: NullableEnumIjDatePostedFieldUpdateOperationsInput | $Enums.IjDatePosted | null
    workModels?: CampaignInfojobsUpdateworkModelsInput | $Enums.IjWorkModel[]
    jobAreas?: CampaignInfojobsUpdatejobAreasInput | $Enums.IjJobArea[]
    contractTypes?: CampaignInfojobsUpdatecontractTypesInput | $Enums.IjContract[]
    workSchedules?: CampaignInfojobsUpdateworkSchedulesInput | $Enums.IjSchedule[]
    seniorityLevels?: CampaignInfojobsUpdateseniorityLevelsInput | $Enums.IjSeniority[]
    pcdTypes?: CampaignInfojobsUpdatepcdTypesInput | $Enums.IjPcd[]
  }

  export type JobApplicationCreateInput = {
    id?: string
    platform?: $Enums.Platform | null
    companyName?: string | null
    jobTitle?: string | null
    jobUrl?: string | null
    status?: $Enums.AppStatus | null
    errorLog?: string | null
    appliedAt?: Date | string | null
    createdAt?: Date | string | null
    campaign?: CampaignCreateNestedOneWithoutJobApplicationsInput
    user?: UserCreateNestedOneWithoutJobApplicationsInput
  }

  export type JobApplicationUncheckedCreateInput = {
    id?: string
    campaignId?: string | null
    userId?: string | null
    platform?: $Enums.Platform | null
    companyName?: string | null
    jobTitle?: string | null
    jobUrl?: string | null
    status?: $Enums.AppStatus | null
    errorLog?: string | null
    appliedAt?: Date | string | null
    createdAt?: Date | string | null
  }

  export type JobApplicationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    platform?: NullableEnumPlatformFieldUpdateOperationsInput | $Enums.Platform | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    jobTitle?: NullableStringFieldUpdateOperationsInput | string | null
    jobUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableEnumAppStatusFieldUpdateOperationsInput | $Enums.AppStatus | null
    errorLog?: NullableStringFieldUpdateOperationsInput | string | null
    appliedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    campaign?: CampaignUpdateOneWithoutJobApplicationsNestedInput
    user?: UserUpdateOneWithoutJobApplicationsNestedInput
  }

  export type JobApplicationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    campaignId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    platform?: NullableEnumPlatformFieldUpdateOperationsInput | $Enums.Platform | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    jobTitle?: NullableStringFieldUpdateOperationsInput | string | null
    jobUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableEnumAppStatusFieldUpdateOperationsInput | $Enums.AppStatus | null
    errorLog?: NullableStringFieldUpdateOperationsInput | string | null
    appliedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type JobApplicationCreateManyInput = {
    id?: string
    campaignId?: string | null
    userId?: string | null
    platform?: $Enums.Platform | null
    companyName?: string | null
    jobTitle?: string | null
    jobUrl?: string | null
    status?: $Enums.AppStatus | null
    errorLog?: string | null
    appliedAt?: Date | string | null
    createdAt?: Date | string | null
  }

  export type JobApplicationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    platform?: NullableEnumPlatformFieldUpdateOperationsInput | $Enums.Platform | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    jobTitle?: NullableStringFieldUpdateOperationsInput | string | null
    jobUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableEnumAppStatusFieldUpdateOperationsInput | $Enums.AppStatus | null
    errorLog?: NullableStringFieldUpdateOperationsInput | string | null
    appliedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type JobApplicationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    campaignId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    platform?: NullableEnumPlatformFieldUpdateOperationsInput | $Enums.Platform | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    jobTitle?: NullableStringFieldUpdateOperationsInput | string | null
    jobUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableEnumAppStatusFieldUpdateOperationsInput | $Enums.AppStatus | null
    errorLog?: NullableStringFieldUpdateOperationsInput | string | null
    appliedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type EnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type ResumeListRelationFilter = {
    every?: ResumeWhereInput
    some?: ResumeWhereInput
    none?: ResumeWhereInput
  }

  export type CampaignListRelationFilter = {
    every?: CampaignWhereInput
    some?: CampaignWhereInput
    none?: CampaignWhereInput
  }

  export type JobApplicationListRelationFilter = {
    every?: JobApplicationWhereInput
    some?: JobApplicationWhereInput
    none?: JobApplicationWhereInput
  }

  export type TransactionListRelationFilter = {
    every?: TransactionWhereInput
    some?: TransactionWhereInput
    none?: TransactionWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ResumeOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CampaignOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type JobApplicationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TransactionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    stripeCustomerId?: SortOrder
    credits?: SortOrder
    planTier?: SortOrder
    createdAt?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    credits?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    stripeCustomerId?: SortOrder
    credits?: SortOrder
    planTier?: SortOrder
    createdAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    stripeCustomerId?: SortOrder
    credits?: SortOrder
    planTier?: SortOrder
    createdAt?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    credits?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type UuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type EnumTransactionTypeNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.TransactionType | EnumTransactionTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.TransactionType[] | ListEnumTransactionTypeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.TransactionType[] | ListEnumTransactionTypeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumTransactionTypeNullableFilter<$PrismaModel> | $Enums.TransactionType | null
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type TransactionCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    amount?: SortOrder
    type?: SortOrder
    reference_id?: SortOrder
    description?: SortOrder
    created_at?: SortOrder
  }

  export type TransactionAvgOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type TransactionMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    amount?: SortOrder
    type?: SortOrder
    reference_id?: SortOrder
    description?: SortOrder
    created_at?: SortOrder
  }

  export type TransactionMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    amount?: SortOrder
    type?: SortOrder
    reference_id?: SortOrder
    description?: SortOrder
    created_at?: SortOrder
  }

  export type TransactionSumOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type UuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type EnumTransactionTypeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TransactionType | EnumTransactionTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.TransactionType[] | ListEnumTransactionTypeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.TransactionType[] | ListEnumTransactionTypeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumTransactionTypeNullableWithAggregatesFilter<$PrismaModel> | $Enums.TransactionType | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumTransactionTypeNullableFilter<$PrismaModel>
    _max?: NestedEnumTransactionTypeNullableFilter<$PrismaModel>
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type ResumeCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    personalInfo?: SortOrder
    education?: SortOrder
    experience?: SortOrder
    skills?: SortOrder
    isDefault?: SortOrder
    createdAt?: SortOrder
  }

  export type ResumeMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    isDefault?: SortOrder
    createdAt?: SortOrder
  }

  export type ResumeMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    isDefault?: SortOrder
    createdAt?: SortOrder
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type UuidNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidNullableFilter<$PrismaModel> | string | null
  }

  export type EnumPlatformNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.Platform | EnumPlatformFieldRefInput<$PrismaModel> | null
    in?: $Enums.Platform[] | ListEnumPlatformFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.Platform[] | ListEnumPlatformFieldRefInput<$PrismaModel> | null
    not?: NestedEnumPlatformNullableFilter<$PrismaModel> | $Enums.Platform | null
  }

  export type ResumeNullableScalarRelationFilter = {
    is?: ResumeWhereInput | null
    isNot?: ResumeWhereInput | null
  }

  export type CampaignLinkedinNullableScalarRelationFilter = {
    is?: CampaignLinkedinWhereInput | null
    isNot?: CampaignLinkedinWhereInput | null
  }

  export type CampaignInfojobsNullableScalarRelationFilter = {
    is?: CampaignInfojobsWhereInput | null
    isNot?: CampaignInfojobsWhereInput | null
  }

  export type CampaignCountOrderByAggregateInput = {
    id?: SortOrder
    resumeId?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    platform?: SortOrder
    status?: SortOrder
    dailyLimit?: SortOrder
    createdAt?: SortOrder
  }

  export type CampaignAvgOrderByAggregateInput = {
    dailyLimit?: SortOrder
  }

  export type CampaignMaxOrderByAggregateInput = {
    id?: SortOrder
    resumeId?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    platform?: SortOrder
    status?: SortOrder
    dailyLimit?: SortOrder
    createdAt?: SortOrder
  }

  export type CampaignMinOrderByAggregateInput = {
    id?: SortOrder
    resumeId?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    platform?: SortOrder
    status?: SortOrder
    dailyLimit?: SortOrder
    createdAt?: SortOrder
  }

  export type CampaignSumOrderByAggregateInput = {
    dailyLimit?: SortOrder
  }

  export type UuidNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumPlatformNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Platform | EnumPlatformFieldRefInput<$PrismaModel> | null
    in?: $Enums.Platform[] | ListEnumPlatformFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.Platform[] | ListEnumPlatformFieldRefInput<$PrismaModel> | null
    not?: NestedEnumPlatformNullableWithAggregatesFilter<$PrismaModel> | $Enums.Platform | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumPlatformNullableFilter<$PrismaModel>
    _max?: NestedEnumPlatformNullableFilter<$PrismaModel>
  }

  export type EnumLinkedinSortNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.LinkedinSort | EnumLinkedinSortFieldRefInput<$PrismaModel> | null
    in?: $Enums.LinkedinSort[] | ListEnumLinkedinSortFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.LinkedinSort[] | ListEnumLinkedinSortFieldRefInput<$PrismaModel> | null
    not?: NestedEnumLinkedinSortNullableFilter<$PrismaModel> | $Enums.LinkedinSort | null
  }

  export type EnumLinkedinDateNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.LinkedinDate | EnumLinkedinDateFieldRefInput<$PrismaModel> | null
    in?: $Enums.LinkedinDate[] | ListEnumLinkedinDateFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.LinkedinDate[] | ListEnumLinkedinDateFieldRefInput<$PrismaModel> | null
    not?: NestedEnumLinkedinDateNullableFilter<$PrismaModel> | $Enums.LinkedinDate | null
  }

  export type EnumLinkedinExpNullableListFilter<$PrismaModel = never> = {
    equals?: $Enums.LinkedinExp[] | ListEnumLinkedinExpFieldRefInput<$PrismaModel> | null
    has?: $Enums.LinkedinExp | EnumLinkedinExpFieldRefInput<$PrismaModel> | null
    hasEvery?: $Enums.LinkedinExp[] | ListEnumLinkedinExpFieldRefInput<$PrismaModel>
    hasSome?: $Enums.LinkedinExp[] | ListEnumLinkedinExpFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type EnumLinkedinJobTypeNullableListFilter<$PrismaModel = never> = {
    equals?: $Enums.LinkedinJobType[] | ListEnumLinkedinJobTypeFieldRefInput<$PrismaModel> | null
    has?: $Enums.LinkedinJobType | EnumLinkedinJobTypeFieldRefInput<$PrismaModel> | null
    hasEvery?: $Enums.LinkedinJobType[] | ListEnumLinkedinJobTypeFieldRefInput<$PrismaModel>
    hasSome?: $Enums.LinkedinJobType[] | ListEnumLinkedinJobTypeFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type EnumLinkedinRemoteNullableListFilter<$PrismaModel = never> = {
    equals?: $Enums.LinkedinRemote[] | ListEnumLinkedinRemoteFieldRefInput<$PrismaModel> | null
    has?: $Enums.LinkedinRemote | EnumLinkedinRemoteFieldRefInput<$PrismaModel> | null
    hasEvery?: $Enums.LinkedinRemote[] | ListEnumLinkedinRemoteFieldRefInput<$PrismaModel>
    hasSome?: $Enums.LinkedinRemote[] | ListEnumLinkedinRemoteFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type CampaignNullableScalarRelationFilter = {
    is?: CampaignWhereInput | null
    isNot?: CampaignWhereInput | null
  }

  export type CampaignLinkedinCountOrderByAggregateInput = {
    id?: SortOrder
    campaignId?: SortOrder
    searchTerms?: SortOrder
    locationTerm?: SortOrder
    sortBy?: SortOrder
    datePosted?: SortOrder
    expLevel?: SortOrder
    jobType?: SortOrder
    remoteFilter?: SortOrder
  }

  export type CampaignLinkedinMaxOrderByAggregateInput = {
    id?: SortOrder
    campaignId?: SortOrder
    searchTerms?: SortOrder
    locationTerm?: SortOrder
    sortBy?: SortOrder
    datePosted?: SortOrder
  }

  export type CampaignLinkedinMinOrderByAggregateInput = {
    id?: SortOrder
    campaignId?: SortOrder
    searchTerms?: SortOrder
    locationTerm?: SortOrder
    sortBy?: SortOrder
    datePosted?: SortOrder
  }

  export type EnumLinkedinSortNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LinkedinSort | EnumLinkedinSortFieldRefInput<$PrismaModel> | null
    in?: $Enums.LinkedinSort[] | ListEnumLinkedinSortFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.LinkedinSort[] | ListEnumLinkedinSortFieldRefInput<$PrismaModel> | null
    not?: NestedEnumLinkedinSortNullableWithAggregatesFilter<$PrismaModel> | $Enums.LinkedinSort | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumLinkedinSortNullableFilter<$PrismaModel>
    _max?: NestedEnumLinkedinSortNullableFilter<$PrismaModel>
  }

  export type EnumLinkedinDateNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LinkedinDate | EnumLinkedinDateFieldRefInput<$PrismaModel> | null
    in?: $Enums.LinkedinDate[] | ListEnumLinkedinDateFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.LinkedinDate[] | ListEnumLinkedinDateFieldRefInput<$PrismaModel> | null
    not?: NestedEnumLinkedinDateNullableWithAggregatesFilter<$PrismaModel> | $Enums.LinkedinDate | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumLinkedinDateNullableFilter<$PrismaModel>
    _max?: NestedEnumLinkedinDateNullableFilter<$PrismaModel>
  }

  export type EnumBrazilStateNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.BrazilState | EnumBrazilStateFieldRefInput<$PrismaModel> | null
    in?: $Enums.BrazilState[] | ListEnumBrazilStateFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.BrazilState[] | ListEnumBrazilStateFieldRefInput<$PrismaModel> | null
    not?: NestedEnumBrazilStateNullableFilter<$PrismaModel> | $Enums.BrazilState | null
  }

  export type EnumIjRadiusNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.IjRadius | EnumIjRadiusFieldRefInput<$PrismaModel> | null
    in?: $Enums.IjRadius[] | ListEnumIjRadiusFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.IjRadius[] | ListEnumIjRadiusFieldRefInput<$PrismaModel> | null
    not?: NestedEnumIjRadiusNullableFilter<$PrismaModel> | $Enums.IjRadius | null
  }

  export type EnumIjSalaryNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.IjSalary | EnumIjSalaryFieldRefInput<$PrismaModel> | null
    in?: $Enums.IjSalary[] | ListEnumIjSalaryFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.IjSalary[] | ListEnumIjSalaryFieldRefInput<$PrismaModel> | null
    not?: NestedEnumIjSalaryNullableFilter<$PrismaModel> | $Enums.IjSalary | null
  }

  export type EnumIjDatePostedNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.IjDatePosted | EnumIjDatePostedFieldRefInput<$PrismaModel> | null
    in?: $Enums.IjDatePosted[] | ListEnumIjDatePostedFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.IjDatePosted[] | ListEnumIjDatePostedFieldRefInput<$PrismaModel> | null
    not?: NestedEnumIjDatePostedNullableFilter<$PrismaModel> | $Enums.IjDatePosted | null
  }

  export type EnumIjWorkModelNullableListFilter<$PrismaModel = never> = {
    equals?: $Enums.IjWorkModel[] | ListEnumIjWorkModelFieldRefInput<$PrismaModel> | null
    has?: $Enums.IjWorkModel | EnumIjWorkModelFieldRefInput<$PrismaModel> | null
    hasEvery?: $Enums.IjWorkModel[] | ListEnumIjWorkModelFieldRefInput<$PrismaModel>
    hasSome?: $Enums.IjWorkModel[] | ListEnumIjWorkModelFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type EnumIjJobAreaNullableListFilter<$PrismaModel = never> = {
    equals?: $Enums.IjJobArea[] | ListEnumIjJobAreaFieldRefInput<$PrismaModel> | null
    has?: $Enums.IjJobArea | EnumIjJobAreaFieldRefInput<$PrismaModel> | null
    hasEvery?: $Enums.IjJobArea[] | ListEnumIjJobAreaFieldRefInput<$PrismaModel>
    hasSome?: $Enums.IjJobArea[] | ListEnumIjJobAreaFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type EnumIjContractNullableListFilter<$PrismaModel = never> = {
    equals?: $Enums.IjContract[] | ListEnumIjContractFieldRefInput<$PrismaModel> | null
    has?: $Enums.IjContract | EnumIjContractFieldRefInput<$PrismaModel> | null
    hasEvery?: $Enums.IjContract[] | ListEnumIjContractFieldRefInput<$PrismaModel>
    hasSome?: $Enums.IjContract[] | ListEnumIjContractFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type EnumIjScheduleNullableListFilter<$PrismaModel = never> = {
    equals?: $Enums.IjSchedule[] | ListEnumIjScheduleFieldRefInput<$PrismaModel> | null
    has?: $Enums.IjSchedule | EnumIjScheduleFieldRefInput<$PrismaModel> | null
    hasEvery?: $Enums.IjSchedule[] | ListEnumIjScheduleFieldRefInput<$PrismaModel>
    hasSome?: $Enums.IjSchedule[] | ListEnumIjScheduleFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type EnumIjSeniorityNullableListFilter<$PrismaModel = never> = {
    equals?: $Enums.IjSeniority[] | ListEnumIjSeniorityFieldRefInput<$PrismaModel> | null
    has?: $Enums.IjSeniority | EnumIjSeniorityFieldRefInput<$PrismaModel> | null
    hasEvery?: $Enums.IjSeniority[] | ListEnumIjSeniorityFieldRefInput<$PrismaModel>
    hasSome?: $Enums.IjSeniority[] | ListEnumIjSeniorityFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type EnumIjPcdNullableListFilter<$PrismaModel = never> = {
    equals?: $Enums.IjPcd[] | ListEnumIjPcdFieldRefInput<$PrismaModel> | null
    has?: $Enums.IjPcd | EnumIjPcdFieldRefInput<$PrismaModel> | null
    hasEvery?: $Enums.IjPcd[] | ListEnumIjPcdFieldRefInput<$PrismaModel>
    hasSome?: $Enums.IjPcd[] | ListEnumIjPcdFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type CampaignInfojobsCountOrderByAggregateInput = {
    id?: SortOrder
    campaignId?: SortOrder
    searchTerms?: SortOrder
    locationState?: SortOrder
    kmDeVoce?: SortOrder
    salaryFilter?: SortOrder
    datePosted?: SortOrder
    workModels?: SortOrder
    jobAreas?: SortOrder
    contractTypes?: SortOrder
    workSchedules?: SortOrder
    seniorityLevels?: SortOrder
    pcdTypes?: SortOrder
  }

  export type CampaignInfojobsMaxOrderByAggregateInput = {
    id?: SortOrder
    campaignId?: SortOrder
    searchTerms?: SortOrder
    locationState?: SortOrder
    kmDeVoce?: SortOrder
    salaryFilter?: SortOrder
    datePosted?: SortOrder
  }

  export type CampaignInfojobsMinOrderByAggregateInput = {
    id?: SortOrder
    campaignId?: SortOrder
    searchTerms?: SortOrder
    locationState?: SortOrder
    kmDeVoce?: SortOrder
    salaryFilter?: SortOrder
    datePosted?: SortOrder
  }

  export type EnumBrazilStateNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BrazilState | EnumBrazilStateFieldRefInput<$PrismaModel> | null
    in?: $Enums.BrazilState[] | ListEnumBrazilStateFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.BrazilState[] | ListEnumBrazilStateFieldRefInput<$PrismaModel> | null
    not?: NestedEnumBrazilStateNullableWithAggregatesFilter<$PrismaModel> | $Enums.BrazilState | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumBrazilStateNullableFilter<$PrismaModel>
    _max?: NestedEnumBrazilStateNullableFilter<$PrismaModel>
  }

  export type EnumIjRadiusNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.IjRadius | EnumIjRadiusFieldRefInput<$PrismaModel> | null
    in?: $Enums.IjRadius[] | ListEnumIjRadiusFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.IjRadius[] | ListEnumIjRadiusFieldRefInput<$PrismaModel> | null
    not?: NestedEnumIjRadiusNullableWithAggregatesFilter<$PrismaModel> | $Enums.IjRadius | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumIjRadiusNullableFilter<$PrismaModel>
    _max?: NestedEnumIjRadiusNullableFilter<$PrismaModel>
  }

  export type EnumIjSalaryNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.IjSalary | EnumIjSalaryFieldRefInput<$PrismaModel> | null
    in?: $Enums.IjSalary[] | ListEnumIjSalaryFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.IjSalary[] | ListEnumIjSalaryFieldRefInput<$PrismaModel> | null
    not?: NestedEnumIjSalaryNullableWithAggregatesFilter<$PrismaModel> | $Enums.IjSalary | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumIjSalaryNullableFilter<$PrismaModel>
    _max?: NestedEnumIjSalaryNullableFilter<$PrismaModel>
  }

  export type EnumIjDatePostedNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.IjDatePosted | EnumIjDatePostedFieldRefInput<$PrismaModel> | null
    in?: $Enums.IjDatePosted[] | ListEnumIjDatePostedFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.IjDatePosted[] | ListEnumIjDatePostedFieldRefInput<$PrismaModel> | null
    not?: NestedEnumIjDatePostedNullableWithAggregatesFilter<$PrismaModel> | $Enums.IjDatePosted | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumIjDatePostedNullableFilter<$PrismaModel>
    _max?: NestedEnumIjDatePostedNullableFilter<$PrismaModel>
  }

  export type EnumAppStatusNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.AppStatus | EnumAppStatusFieldRefInput<$PrismaModel> | null
    in?: $Enums.AppStatus[] | ListEnumAppStatusFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.AppStatus[] | ListEnumAppStatusFieldRefInput<$PrismaModel> | null
    not?: NestedEnumAppStatusNullableFilter<$PrismaModel> | $Enums.AppStatus | null
  }

  export type JobApplicationCountOrderByAggregateInput = {
    id?: SortOrder
    campaignId?: SortOrder
    userId?: SortOrder
    platform?: SortOrder
    companyName?: SortOrder
    jobTitle?: SortOrder
    jobUrl?: SortOrder
    status?: SortOrder
    errorLog?: SortOrder
    appliedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type JobApplicationMaxOrderByAggregateInput = {
    id?: SortOrder
    campaignId?: SortOrder
    userId?: SortOrder
    platform?: SortOrder
    companyName?: SortOrder
    jobTitle?: SortOrder
    jobUrl?: SortOrder
    status?: SortOrder
    errorLog?: SortOrder
    appliedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type JobApplicationMinOrderByAggregateInput = {
    id?: SortOrder
    campaignId?: SortOrder
    userId?: SortOrder
    platform?: SortOrder
    companyName?: SortOrder
    jobTitle?: SortOrder
    jobUrl?: SortOrder
    status?: SortOrder
    errorLog?: SortOrder
    appliedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumAppStatusNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AppStatus | EnumAppStatusFieldRefInput<$PrismaModel> | null
    in?: $Enums.AppStatus[] | ListEnumAppStatusFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.AppStatus[] | ListEnumAppStatusFieldRefInput<$PrismaModel> | null
    not?: NestedEnumAppStatusNullableWithAggregatesFilter<$PrismaModel> | $Enums.AppStatus | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumAppStatusNullableFilter<$PrismaModel>
    _max?: NestedEnumAppStatusNullableFilter<$PrismaModel>
  }

  export type ResumeCreateNestedManyWithoutUserInput = {
    create?: XOR<ResumeCreateWithoutUserInput, ResumeUncheckedCreateWithoutUserInput> | ResumeCreateWithoutUserInput[] | ResumeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ResumeCreateOrConnectWithoutUserInput | ResumeCreateOrConnectWithoutUserInput[]
    createMany?: ResumeCreateManyUserInputEnvelope
    connect?: ResumeWhereUniqueInput | ResumeWhereUniqueInput[]
  }

  export type CampaignCreateNestedManyWithoutUserInput = {
    create?: XOR<CampaignCreateWithoutUserInput, CampaignUncheckedCreateWithoutUserInput> | CampaignCreateWithoutUserInput[] | CampaignUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CampaignCreateOrConnectWithoutUserInput | CampaignCreateOrConnectWithoutUserInput[]
    createMany?: CampaignCreateManyUserInputEnvelope
    connect?: CampaignWhereUniqueInput | CampaignWhereUniqueInput[]
  }

  export type JobApplicationCreateNestedManyWithoutUserInput = {
    create?: XOR<JobApplicationCreateWithoutUserInput, JobApplicationUncheckedCreateWithoutUserInput> | JobApplicationCreateWithoutUserInput[] | JobApplicationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: JobApplicationCreateOrConnectWithoutUserInput | JobApplicationCreateOrConnectWithoutUserInput[]
    createMany?: JobApplicationCreateManyUserInputEnvelope
    connect?: JobApplicationWhereUniqueInput | JobApplicationWhereUniqueInput[]
  }

  export type TransactionCreateNestedManyWithoutUserInput = {
    create?: XOR<TransactionCreateWithoutUserInput, TransactionUncheckedCreateWithoutUserInput> | TransactionCreateWithoutUserInput[] | TransactionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutUserInput | TransactionCreateOrConnectWithoutUserInput[]
    createMany?: TransactionCreateManyUserInputEnvelope
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
  }

  export type TransactionCreateNestedManyWithoutStripeCustomerInput = {
    create?: XOR<TransactionCreateWithoutStripeCustomerInput, TransactionUncheckedCreateWithoutStripeCustomerInput> | TransactionCreateWithoutStripeCustomerInput[] | TransactionUncheckedCreateWithoutStripeCustomerInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutStripeCustomerInput | TransactionCreateOrConnectWithoutStripeCustomerInput[]
    createMany?: TransactionCreateManyStripeCustomerInputEnvelope
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
  }

  export type ResumeUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ResumeCreateWithoutUserInput, ResumeUncheckedCreateWithoutUserInput> | ResumeCreateWithoutUserInput[] | ResumeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ResumeCreateOrConnectWithoutUserInput | ResumeCreateOrConnectWithoutUserInput[]
    createMany?: ResumeCreateManyUserInputEnvelope
    connect?: ResumeWhereUniqueInput | ResumeWhereUniqueInput[]
  }

  export type CampaignUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<CampaignCreateWithoutUserInput, CampaignUncheckedCreateWithoutUserInput> | CampaignCreateWithoutUserInput[] | CampaignUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CampaignCreateOrConnectWithoutUserInput | CampaignCreateOrConnectWithoutUserInput[]
    createMany?: CampaignCreateManyUserInputEnvelope
    connect?: CampaignWhereUniqueInput | CampaignWhereUniqueInput[]
  }

  export type JobApplicationUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<JobApplicationCreateWithoutUserInput, JobApplicationUncheckedCreateWithoutUserInput> | JobApplicationCreateWithoutUserInput[] | JobApplicationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: JobApplicationCreateOrConnectWithoutUserInput | JobApplicationCreateOrConnectWithoutUserInput[]
    createMany?: JobApplicationCreateManyUserInputEnvelope
    connect?: JobApplicationWhereUniqueInput | JobApplicationWhereUniqueInput[]
  }

  export type TransactionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<TransactionCreateWithoutUserInput, TransactionUncheckedCreateWithoutUserInput> | TransactionCreateWithoutUserInput[] | TransactionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutUserInput | TransactionCreateOrConnectWithoutUserInput[]
    createMany?: TransactionCreateManyUserInputEnvelope
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
  }

  export type TransactionUncheckedCreateNestedManyWithoutStripeCustomerInput = {
    create?: XOR<TransactionCreateWithoutStripeCustomerInput, TransactionUncheckedCreateWithoutStripeCustomerInput> | TransactionCreateWithoutStripeCustomerInput[] | TransactionUncheckedCreateWithoutStripeCustomerInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutStripeCustomerInput | TransactionCreateOrConnectWithoutStripeCustomerInput[]
    createMany?: TransactionCreateManyStripeCustomerInputEnvelope
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type EnumUserRoleFieldUpdateOperationsInput = {
    set?: $Enums.UserRole
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type ResumeUpdateManyWithoutUserNestedInput = {
    create?: XOR<ResumeCreateWithoutUserInput, ResumeUncheckedCreateWithoutUserInput> | ResumeCreateWithoutUserInput[] | ResumeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ResumeCreateOrConnectWithoutUserInput | ResumeCreateOrConnectWithoutUserInput[]
    upsert?: ResumeUpsertWithWhereUniqueWithoutUserInput | ResumeUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ResumeCreateManyUserInputEnvelope
    set?: ResumeWhereUniqueInput | ResumeWhereUniqueInput[]
    disconnect?: ResumeWhereUniqueInput | ResumeWhereUniqueInput[]
    delete?: ResumeWhereUniqueInput | ResumeWhereUniqueInput[]
    connect?: ResumeWhereUniqueInput | ResumeWhereUniqueInput[]
    update?: ResumeUpdateWithWhereUniqueWithoutUserInput | ResumeUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ResumeUpdateManyWithWhereWithoutUserInput | ResumeUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ResumeScalarWhereInput | ResumeScalarWhereInput[]
  }

  export type CampaignUpdateManyWithoutUserNestedInput = {
    create?: XOR<CampaignCreateWithoutUserInput, CampaignUncheckedCreateWithoutUserInput> | CampaignCreateWithoutUserInput[] | CampaignUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CampaignCreateOrConnectWithoutUserInput | CampaignCreateOrConnectWithoutUserInput[]
    upsert?: CampaignUpsertWithWhereUniqueWithoutUserInput | CampaignUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: CampaignCreateManyUserInputEnvelope
    set?: CampaignWhereUniqueInput | CampaignWhereUniqueInput[]
    disconnect?: CampaignWhereUniqueInput | CampaignWhereUniqueInput[]
    delete?: CampaignWhereUniqueInput | CampaignWhereUniqueInput[]
    connect?: CampaignWhereUniqueInput | CampaignWhereUniqueInput[]
    update?: CampaignUpdateWithWhereUniqueWithoutUserInput | CampaignUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: CampaignUpdateManyWithWhereWithoutUserInput | CampaignUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: CampaignScalarWhereInput | CampaignScalarWhereInput[]
  }

  export type JobApplicationUpdateManyWithoutUserNestedInput = {
    create?: XOR<JobApplicationCreateWithoutUserInput, JobApplicationUncheckedCreateWithoutUserInput> | JobApplicationCreateWithoutUserInput[] | JobApplicationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: JobApplicationCreateOrConnectWithoutUserInput | JobApplicationCreateOrConnectWithoutUserInput[]
    upsert?: JobApplicationUpsertWithWhereUniqueWithoutUserInput | JobApplicationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: JobApplicationCreateManyUserInputEnvelope
    set?: JobApplicationWhereUniqueInput | JobApplicationWhereUniqueInput[]
    disconnect?: JobApplicationWhereUniqueInput | JobApplicationWhereUniqueInput[]
    delete?: JobApplicationWhereUniqueInput | JobApplicationWhereUniqueInput[]
    connect?: JobApplicationWhereUniqueInput | JobApplicationWhereUniqueInput[]
    update?: JobApplicationUpdateWithWhereUniqueWithoutUserInput | JobApplicationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: JobApplicationUpdateManyWithWhereWithoutUserInput | JobApplicationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: JobApplicationScalarWhereInput | JobApplicationScalarWhereInput[]
  }

  export type TransactionUpdateManyWithoutUserNestedInput = {
    create?: XOR<TransactionCreateWithoutUserInput, TransactionUncheckedCreateWithoutUserInput> | TransactionCreateWithoutUserInput[] | TransactionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutUserInput | TransactionCreateOrConnectWithoutUserInput[]
    upsert?: TransactionUpsertWithWhereUniqueWithoutUserInput | TransactionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TransactionCreateManyUserInputEnvelope
    set?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    disconnect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    delete?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    update?: TransactionUpdateWithWhereUniqueWithoutUserInput | TransactionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TransactionUpdateManyWithWhereWithoutUserInput | TransactionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
  }

  export type TransactionUpdateManyWithoutStripeCustomerNestedInput = {
    create?: XOR<TransactionCreateWithoutStripeCustomerInput, TransactionUncheckedCreateWithoutStripeCustomerInput> | TransactionCreateWithoutStripeCustomerInput[] | TransactionUncheckedCreateWithoutStripeCustomerInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutStripeCustomerInput | TransactionCreateOrConnectWithoutStripeCustomerInput[]
    upsert?: TransactionUpsertWithWhereUniqueWithoutStripeCustomerInput | TransactionUpsertWithWhereUniqueWithoutStripeCustomerInput[]
    createMany?: TransactionCreateManyStripeCustomerInputEnvelope
    set?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    disconnect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    delete?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    update?: TransactionUpdateWithWhereUniqueWithoutStripeCustomerInput | TransactionUpdateWithWhereUniqueWithoutStripeCustomerInput[]
    updateMany?: TransactionUpdateManyWithWhereWithoutStripeCustomerInput | TransactionUpdateManyWithWhereWithoutStripeCustomerInput[]
    deleteMany?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
  }

  export type ResumeUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ResumeCreateWithoutUserInput, ResumeUncheckedCreateWithoutUserInput> | ResumeCreateWithoutUserInput[] | ResumeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ResumeCreateOrConnectWithoutUserInput | ResumeCreateOrConnectWithoutUserInput[]
    upsert?: ResumeUpsertWithWhereUniqueWithoutUserInput | ResumeUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ResumeCreateManyUserInputEnvelope
    set?: ResumeWhereUniqueInput | ResumeWhereUniqueInput[]
    disconnect?: ResumeWhereUniqueInput | ResumeWhereUniqueInput[]
    delete?: ResumeWhereUniqueInput | ResumeWhereUniqueInput[]
    connect?: ResumeWhereUniqueInput | ResumeWhereUniqueInput[]
    update?: ResumeUpdateWithWhereUniqueWithoutUserInput | ResumeUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ResumeUpdateManyWithWhereWithoutUserInput | ResumeUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ResumeScalarWhereInput | ResumeScalarWhereInput[]
  }

  export type CampaignUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<CampaignCreateWithoutUserInput, CampaignUncheckedCreateWithoutUserInput> | CampaignCreateWithoutUserInput[] | CampaignUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CampaignCreateOrConnectWithoutUserInput | CampaignCreateOrConnectWithoutUserInput[]
    upsert?: CampaignUpsertWithWhereUniqueWithoutUserInput | CampaignUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: CampaignCreateManyUserInputEnvelope
    set?: CampaignWhereUniqueInput | CampaignWhereUniqueInput[]
    disconnect?: CampaignWhereUniqueInput | CampaignWhereUniqueInput[]
    delete?: CampaignWhereUniqueInput | CampaignWhereUniqueInput[]
    connect?: CampaignWhereUniqueInput | CampaignWhereUniqueInput[]
    update?: CampaignUpdateWithWhereUniqueWithoutUserInput | CampaignUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: CampaignUpdateManyWithWhereWithoutUserInput | CampaignUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: CampaignScalarWhereInput | CampaignScalarWhereInput[]
  }

  export type JobApplicationUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<JobApplicationCreateWithoutUserInput, JobApplicationUncheckedCreateWithoutUserInput> | JobApplicationCreateWithoutUserInput[] | JobApplicationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: JobApplicationCreateOrConnectWithoutUserInput | JobApplicationCreateOrConnectWithoutUserInput[]
    upsert?: JobApplicationUpsertWithWhereUniqueWithoutUserInput | JobApplicationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: JobApplicationCreateManyUserInputEnvelope
    set?: JobApplicationWhereUniqueInput | JobApplicationWhereUniqueInput[]
    disconnect?: JobApplicationWhereUniqueInput | JobApplicationWhereUniqueInput[]
    delete?: JobApplicationWhereUniqueInput | JobApplicationWhereUniqueInput[]
    connect?: JobApplicationWhereUniqueInput | JobApplicationWhereUniqueInput[]
    update?: JobApplicationUpdateWithWhereUniqueWithoutUserInput | JobApplicationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: JobApplicationUpdateManyWithWhereWithoutUserInput | JobApplicationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: JobApplicationScalarWhereInput | JobApplicationScalarWhereInput[]
  }

  export type TransactionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<TransactionCreateWithoutUserInput, TransactionUncheckedCreateWithoutUserInput> | TransactionCreateWithoutUserInput[] | TransactionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutUserInput | TransactionCreateOrConnectWithoutUserInput[]
    upsert?: TransactionUpsertWithWhereUniqueWithoutUserInput | TransactionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TransactionCreateManyUserInputEnvelope
    set?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    disconnect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    delete?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    update?: TransactionUpdateWithWhereUniqueWithoutUserInput | TransactionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TransactionUpdateManyWithWhereWithoutUserInput | TransactionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
  }

  export type TransactionUncheckedUpdateManyWithoutStripeCustomerNestedInput = {
    create?: XOR<TransactionCreateWithoutStripeCustomerInput, TransactionUncheckedCreateWithoutStripeCustomerInput> | TransactionCreateWithoutStripeCustomerInput[] | TransactionUncheckedCreateWithoutStripeCustomerInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutStripeCustomerInput | TransactionCreateOrConnectWithoutStripeCustomerInput[]
    upsert?: TransactionUpsertWithWhereUniqueWithoutStripeCustomerInput | TransactionUpsertWithWhereUniqueWithoutStripeCustomerInput[]
    createMany?: TransactionCreateManyStripeCustomerInputEnvelope
    set?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    disconnect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    delete?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    update?: TransactionUpdateWithWhereUniqueWithoutStripeCustomerInput | TransactionUpdateWithWhereUniqueWithoutStripeCustomerInput[]
    updateMany?: TransactionUpdateManyWithWhereWithoutStripeCustomerInput | TransactionUpdateManyWithWhereWithoutStripeCustomerInput[]
    deleteMany?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutTransactionInput = {
    create?: XOR<UserCreateWithoutTransactionInput, UserUncheckedCreateWithoutTransactionInput>
    connectOrCreate?: UserCreateOrConnectWithoutTransactionInput
    connect?: UserWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutStripeTransactionInput = {
    create?: XOR<UserCreateWithoutStripeTransactionInput, UserUncheckedCreateWithoutStripeTransactionInput>
    connectOrCreate?: UserCreateOrConnectWithoutStripeTransactionInput
    connect?: UserWhereUniqueInput
  }

  export type NullableEnumTransactionTypeFieldUpdateOperationsInput = {
    set?: $Enums.TransactionType | null
  }

  export type UserUpdateOneWithoutTransactionNestedInput = {
    create?: XOR<UserCreateWithoutTransactionInput, UserUncheckedCreateWithoutTransactionInput>
    connectOrCreate?: UserCreateOrConnectWithoutTransactionInput
    upsert?: UserUpsertWithoutTransactionInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutTransactionInput, UserUpdateWithoutTransactionInput>, UserUncheckedUpdateWithoutTransactionInput>
  }

  export type UserUpdateOneWithoutStripeTransactionNestedInput = {
    create?: XOR<UserCreateWithoutStripeTransactionInput, UserUncheckedCreateWithoutStripeTransactionInput>
    connectOrCreate?: UserCreateOrConnectWithoutStripeTransactionInput
    upsert?: UserUpsertWithoutStripeTransactionInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutStripeTransactionInput, UserUpdateWithoutStripeTransactionInput>, UserUncheckedUpdateWithoutStripeTransactionInput>
  }

  export type UserCreateNestedOneWithoutResumesInput = {
    create?: XOR<UserCreateWithoutResumesInput, UserUncheckedCreateWithoutResumesInput>
    connectOrCreate?: UserCreateOrConnectWithoutResumesInput
    connect?: UserWhereUniqueInput
  }

  export type CampaignCreateNestedManyWithoutResumeInput = {
    create?: XOR<CampaignCreateWithoutResumeInput, CampaignUncheckedCreateWithoutResumeInput> | CampaignCreateWithoutResumeInput[] | CampaignUncheckedCreateWithoutResumeInput[]
    connectOrCreate?: CampaignCreateOrConnectWithoutResumeInput | CampaignCreateOrConnectWithoutResumeInput[]
    createMany?: CampaignCreateManyResumeInputEnvelope
    connect?: CampaignWhereUniqueInput | CampaignWhereUniqueInput[]
  }

  export type CampaignUncheckedCreateNestedManyWithoutResumeInput = {
    create?: XOR<CampaignCreateWithoutResumeInput, CampaignUncheckedCreateWithoutResumeInput> | CampaignCreateWithoutResumeInput[] | CampaignUncheckedCreateWithoutResumeInput[]
    connectOrCreate?: CampaignCreateOrConnectWithoutResumeInput | CampaignCreateOrConnectWithoutResumeInput[]
    createMany?: CampaignCreateManyResumeInputEnvelope
    connect?: CampaignWhereUniqueInput | CampaignWhereUniqueInput[]
  }

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
  }

  export type UserUpdateOneWithoutResumesNestedInput = {
    create?: XOR<UserCreateWithoutResumesInput, UserUncheckedCreateWithoutResumesInput>
    connectOrCreate?: UserCreateOrConnectWithoutResumesInput
    upsert?: UserUpsertWithoutResumesInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutResumesInput, UserUpdateWithoutResumesInput>, UserUncheckedUpdateWithoutResumesInput>
  }

  export type CampaignUpdateManyWithoutResumeNestedInput = {
    create?: XOR<CampaignCreateWithoutResumeInput, CampaignUncheckedCreateWithoutResumeInput> | CampaignCreateWithoutResumeInput[] | CampaignUncheckedCreateWithoutResumeInput[]
    connectOrCreate?: CampaignCreateOrConnectWithoutResumeInput | CampaignCreateOrConnectWithoutResumeInput[]
    upsert?: CampaignUpsertWithWhereUniqueWithoutResumeInput | CampaignUpsertWithWhereUniqueWithoutResumeInput[]
    createMany?: CampaignCreateManyResumeInputEnvelope
    set?: CampaignWhereUniqueInput | CampaignWhereUniqueInput[]
    disconnect?: CampaignWhereUniqueInput | CampaignWhereUniqueInput[]
    delete?: CampaignWhereUniqueInput | CampaignWhereUniqueInput[]
    connect?: CampaignWhereUniqueInput | CampaignWhereUniqueInput[]
    update?: CampaignUpdateWithWhereUniqueWithoutResumeInput | CampaignUpdateWithWhereUniqueWithoutResumeInput[]
    updateMany?: CampaignUpdateManyWithWhereWithoutResumeInput | CampaignUpdateManyWithWhereWithoutResumeInput[]
    deleteMany?: CampaignScalarWhereInput | CampaignScalarWhereInput[]
  }

  export type CampaignUncheckedUpdateManyWithoutResumeNestedInput = {
    create?: XOR<CampaignCreateWithoutResumeInput, CampaignUncheckedCreateWithoutResumeInput> | CampaignCreateWithoutResumeInput[] | CampaignUncheckedCreateWithoutResumeInput[]
    connectOrCreate?: CampaignCreateOrConnectWithoutResumeInput | CampaignCreateOrConnectWithoutResumeInput[]
    upsert?: CampaignUpsertWithWhereUniqueWithoutResumeInput | CampaignUpsertWithWhereUniqueWithoutResumeInput[]
    createMany?: CampaignCreateManyResumeInputEnvelope
    set?: CampaignWhereUniqueInput | CampaignWhereUniqueInput[]
    disconnect?: CampaignWhereUniqueInput | CampaignWhereUniqueInput[]
    delete?: CampaignWhereUniqueInput | CampaignWhereUniqueInput[]
    connect?: CampaignWhereUniqueInput | CampaignWhereUniqueInput[]
    update?: CampaignUpdateWithWhereUniqueWithoutResumeInput | CampaignUpdateWithWhereUniqueWithoutResumeInput[]
    updateMany?: CampaignUpdateManyWithWhereWithoutResumeInput | CampaignUpdateManyWithWhereWithoutResumeInput[]
    deleteMany?: CampaignScalarWhereInput | CampaignScalarWhereInput[]
  }

  export type ResumeCreateNestedOneWithoutCampaignsInput = {
    create?: XOR<ResumeCreateWithoutCampaignsInput, ResumeUncheckedCreateWithoutCampaignsInput>
    connectOrCreate?: ResumeCreateOrConnectWithoutCampaignsInput
    connect?: ResumeWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutCampaignsInput = {
    create?: XOR<UserCreateWithoutCampaignsInput, UserUncheckedCreateWithoutCampaignsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCampaignsInput
    connect?: UserWhereUniqueInput
  }

  export type CampaignLinkedinCreateNestedOneWithoutCampaignInput = {
    create?: XOR<CampaignLinkedinCreateWithoutCampaignInput, CampaignLinkedinUncheckedCreateWithoutCampaignInput>
    connectOrCreate?: CampaignLinkedinCreateOrConnectWithoutCampaignInput
    connect?: CampaignLinkedinWhereUniqueInput
  }

  export type CampaignInfojobsCreateNestedOneWithoutCampaignInput = {
    create?: XOR<CampaignInfojobsCreateWithoutCampaignInput, CampaignInfojobsUncheckedCreateWithoutCampaignInput>
    connectOrCreate?: CampaignInfojobsCreateOrConnectWithoutCampaignInput
    connect?: CampaignInfojobsWhereUniqueInput
  }

  export type JobApplicationCreateNestedManyWithoutCampaignInput = {
    create?: XOR<JobApplicationCreateWithoutCampaignInput, JobApplicationUncheckedCreateWithoutCampaignInput> | JobApplicationCreateWithoutCampaignInput[] | JobApplicationUncheckedCreateWithoutCampaignInput[]
    connectOrCreate?: JobApplicationCreateOrConnectWithoutCampaignInput | JobApplicationCreateOrConnectWithoutCampaignInput[]
    createMany?: JobApplicationCreateManyCampaignInputEnvelope
    connect?: JobApplicationWhereUniqueInput | JobApplicationWhereUniqueInput[]
  }

  export type CampaignLinkedinUncheckedCreateNestedOneWithoutCampaignInput = {
    create?: XOR<CampaignLinkedinCreateWithoutCampaignInput, CampaignLinkedinUncheckedCreateWithoutCampaignInput>
    connectOrCreate?: CampaignLinkedinCreateOrConnectWithoutCampaignInput
    connect?: CampaignLinkedinWhereUniqueInput
  }

  export type CampaignInfojobsUncheckedCreateNestedOneWithoutCampaignInput = {
    create?: XOR<CampaignInfojobsCreateWithoutCampaignInput, CampaignInfojobsUncheckedCreateWithoutCampaignInput>
    connectOrCreate?: CampaignInfojobsCreateOrConnectWithoutCampaignInput
    connect?: CampaignInfojobsWhereUniqueInput
  }

  export type JobApplicationUncheckedCreateNestedManyWithoutCampaignInput = {
    create?: XOR<JobApplicationCreateWithoutCampaignInput, JobApplicationUncheckedCreateWithoutCampaignInput> | JobApplicationCreateWithoutCampaignInput[] | JobApplicationUncheckedCreateWithoutCampaignInput[]
    connectOrCreate?: JobApplicationCreateOrConnectWithoutCampaignInput | JobApplicationCreateOrConnectWithoutCampaignInput[]
    createMany?: JobApplicationCreateManyCampaignInputEnvelope
    connect?: JobApplicationWhereUniqueInput | JobApplicationWhereUniqueInput[]
  }

  export type NullableEnumPlatformFieldUpdateOperationsInput = {
    set?: $Enums.Platform | null
  }

  export type ResumeUpdateOneWithoutCampaignsNestedInput = {
    create?: XOR<ResumeCreateWithoutCampaignsInput, ResumeUncheckedCreateWithoutCampaignsInput>
    connectOrCreate?: ResumeCreateOrConnectWithoutCampaignsInput
    upsert?: ResumeUpsertWithoutCampaignsInput
    disconnect?: ResumeWhereInput | boolean
    delete?: ResumeWhereInput | boolean
    connect?: ResumeWhereUniqueInput
    update?: XOR<XOR<ResumeUpdateToOneWithWhereWithoutCampaignsInput, ResumeUpdateWithoutCampaignsInput>, ResumeUncheckedUpdateWithoutCampaignsInput>
  }

  export type UserUpdateOneWithoutCampaignsNestedInput = {
    create?: XOR<UserCreateWithoutCampaignsInput, UserUncheckedCreateWithoutCampaignsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCampaignsInput
    upsert?: UserUpsertWithoutCampaignsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutCampaignsInput, UserUpdateWithoutCampaignsInput>, UserUncheckedUpdateWithoutCampaignsInput>
  }

  export type CampaignLinkedinUpdateOneWithoutCampaignNestedInput = {
    create?: XOR<CampaignLinkedinCreateWithoutCampaignInput, CampaignLinkedinUncheckedCreateWithoutCampaignInput>
    connectOrCreate?: CampaignLinkedinCreateOrConnectWithoutCampaignInput
    upsert?: CampaignLinkedinUpsertWithoutCampaignInput
    disconnect?: CampaignLinkedinWhereInput | boolean
    delete?: CampaignLinkedinWhereInput | boolean
    connect?: CampaignLinkedinWhereUniqueInput
    update?: XOR<XOR<CampaignLinkedinUpdateToOneWithWhereWithoutCampaignInput, CampaignLinkedinUpdateWithoutCampaignInput>, CampaignLinkedinUncheckedUpdateWithoutCampaignInput>
  }

  export type CampaignInfojobsUpdateOneWithoutCampaignNestedInput = {
    create?: XOR<CampaignInfojobsCreateWithoutCampaignInput, CampaignInfojobsUncheckedCreateWithoutCampaignInput>
    connectOrCreate?: CampaignInfojobsCreateOrConnectWithoutCampaignInput
    upsert?: CampaignInfojobsUpsertWithoutCampaignInput
    disconnect?: CampaignInfojobsWhereInput | boolean
    delete?: CampaignInfojobsWhereInput | boolean
    connect?: CampaignInfojobsWhereUniqueInput
    update?: XOR<XOR<CampaignInfojobsUpdateToOneWithWhereWithoutCampaignInput, CampaignInfojobsUpdateWithoutCampaignInput>, CampaignInfojobsUncheckedUpdateWithoutCampaignInput>
  }

  export type JobApplicationUpdateManyWithoutCampaignNestedInput = {
    create?: XOR<JobApplicationCreateWithoutCampaignInput, JobApplicationUncheckedCreateWithoutCampaignInput> | JobApplicationCreateWithoutCampaignInput[] | JobApplicationUncheckedCreateWithoutCampaignInput[]
    connectOrCreate?: JobApplicationCreateOrConnectWithoutCampaignInput | JobApplicationCreateOrConnectWithoutCampaignInput[]
    upsert?: JobApplicationUpsertWithWhereUniqueWithoutCampaignInput | JobApplicationUpsertWithWhereUniqueWithoutCampaignInput[]
    createMany?: JobApplicationCreateManyCampaignInputEnvelope
    set?: JobApplicationWhereUniqueInput | JobApplicationWhereUniqueInput[]
    disconnect?: JobApplicationWhereUniqueInput | JobApplicationWhereUniqueInput[]
    delete?: JobApplicationWhereUniqueInput | JobApplicationWhereUniqueInput[]
    connect?: JobApplicationWhereUniqueInput | JobApplicationWhereUniqueInput[]
    update?: JobApplicationUpdateWithWhereUniqueWithoutCampaignInput | JobApplicationUpdateWithWhereUniqueWithoutCampaignInput[]
    updateMany?: JobApplicationUpdateManyWithWhereWithoutCampaignInput | JobApplicationUpdateManyWithWhereWithoutCampaignInput[]
    deleteMany?: JobApplicationScalarWhereInput | JobApplicationScalarWhereInput[]
  }

  export type CampaignLinkedinUncheckedUpdateOneWithoutCampaignNestedInput = {
    create?: XOR<CampaignLinkedinCreateWithoutCampaignInput, CampaignLinkedinUncheckedCreateWithoutCampaignInput>
    connectOrCreate?: CampaignLinkedinCreateOrConnectWithoutCampaignInput
    upsert?: CampaignLinkedinUpsertWithoutCampaignInput
    disconnect?: CampaignLinkedinWhereInput | boolean
    delete?: CampaignLinkedinWhereInput | boolean
    connect?: CampaignLinkedinWhereUniqueInput
    update?: XOR<XOR<CampaignLinkedinUpdateToOneWithWhereWithoutCampaignInput, CampaignLinkedinUpdateWithoutCampaignInput>, CampaignLinkedinUncheckedUpdateWithoutCampaignInput>
  }

  export type CampaignInfojobsUncheckedUpdateOneWithoutCampaignNestedInput = {
    create?: XOR<CampaignInfojobsCreateWithoutCampaignInput, CampaignInfojobsUncheckedCreateWithoutCampaignInput>
    connectOrCreate?: CampaignInfojobsCreateOrConnectWithoutCampaignInput
    upsert?: CampaignInfojobsUpsertWithoutCampaignInput
    disconnect?: CampaignInfojobsWhereInput | boolean
    delete?: CampaignInfojobsWhereInput | boolean
    connect?: CampaignInfojobsWhereUniqueInput
    update?: XOR<XOR<CampaignInfojobsUpdateToOneWithWhereWithoutCampaignInput, CampaignInfojobsUpdateWithoutCampaignInput>, CampaignInfojobsUncheckedUpdateWithoutCampaignInput>
  }

  export type JobApplicationUncheckedUpdateManyWithoutCampaignNestedInput = {
    create?: XOR<JobApplicationCreateWithoutCampaignInput, JobApplicationUncheckedCreateWithoutCampaignInput> | JobApplicationCreateWithoutCampaignInput[] | JobApplicationUncheckedCreateWithoutCampaignInput[]
    connectOrCreate?: JobApplicationCreateOrConnectWithoutCampaignInput | JobApplicationCreateOrConnectWithoutCampaignInput[]
    upsert?: JobApplicationUpsertWithWhereUniqueWithoutCampaignInput | JobApplicationUpsertWithWhereUniqueWithoutCampaignInput[]
    createMany?: JobApplicationCreateManyCampaignInputEnvelope
    set?: JobApplicationWhereUniqueInput | JobApplicationWhereUniqueInput[]
    disconnect?: JobApplicationWhereUniqueInput | JobApplicationWhereUniqueInput[]
    delete?: JobApplicationWhereUniqueInput | JobApplicationWhereUniqueInput[]
    connect?: JobApplicationWhereUniqueInput | JobApplicationWhereUniqueInput[]
    update?: JobApplicationUpdateWithWhereUniqueWithoutCampaignInput | JobApplicationUpdateWithWhereUniqueWithoutCampaignInput[]
    updateMany?: JobApplicationUpdateManyWithWhereWithoutCampaignInput | JobApplicationUpdateManyWithWhereWithoutCampaignInput[]
    deleteMany?: JobApplicationScalarWhereInput | JobApplicationScalarWhereInput[]
  }

  export type CampaignLinkedinCreateexpLevelInput = {
    set: $Enums.LinkedinExp[]
  }

  export type CampaignLinkedinCreatejobTypeInput = {
    set: $Enums.LinkedinJobType[]
  }

  export type CampaignLinkedinCreateremoteFilterInput = {
    set: $Enums.LinkedinRemote[]
  }

  export type CampaignCreateNestedOneWithoutLinkedinConfigInput = {
    create?: XOR<CampaignCreateWithoutLinkedinConfigInput, CampaignUncheckedCreateWithoutLinkedinConfigInput>
    connectOrCreate?: CampaignCreateOrConnectWithoutLinkedinConfigInput
    connect?: CampaignWhereUniqueInput
  }

  export type NullableEnumLinkedinSortFieldUpdateOperationsInput = {
    set?: $Enums.LinkedinSort | null
  }

  export type NullableEnumLinkedinDateFieldUpdateOperationsInput = {
    set?: $Enums.LinkedinDate | null
  }

  export type CampaignLinkedinUpdateexpLevelInput = {
    set?: $Enums.LinkedinExp[]
    push?: $Enums.LinkedinExp | $Enums.LinkedinExp[]
  }

  export type CampaignLinkedinUpdatejobTypeInput = {
    set?: $Enums.LinkedinJobType[]
    push?: $Enums.LinkedinJobType | $Enums.LinkedinJobType[]
  }

  export type CampaignLinkedinUpdateremoteFilterInput = {
    set?: $Enums.LinkedinRemote[]
    push?: $Enums.LinkedinRemote | $Enums.LinkedinRemote[]
  }

  export type CampaignUpdateOneWithoutLinkedinConfigNestedInput = {
    create?: XOR<CampaignCreateWithoutLinkedinConfigInput, CampaignUncheckedCreateWithoutLinkedinConfigInput>
    connectOrCreate?: CampaignCreateOrConnectWithoutLinkedinConfigInput
    upsert?: CampaignUpsertWithoutLinkedinConfigInput
    disconnect?: CampaignWhereInput | boolean
    delete?: CampaignWhereInput | boolean
    connect?: CampaignWhereUniqueInput
    update?: XOR<XOR<CampaignUpdateToOneWithWhereWithoutLinkedinConfigInput, CampaignUpdateWithoutLinkedinConfigInput>, CampaignUncheckedUpdateWithoutLinkedinConfigInput>
  }

  export type CampaignInfojobsCreateworkModelsInput = {
    set: $Enums.IjWorkModel[]
  }

  export type CampaignInfojobsCreatejobAreasInput = {
    set: $Enums.IjJobArea[]
  }

  export type CampaignInfojobsCreatecontractTypesInput = {
    set: $Enums.IjContract[]
  }

  export type CampaignInfojobsCreateworkSchedulesInput = {
    set: $Enums.IjSchedule[]
  }

  export type CampaignInfojobsCreateseniorityLevelsInput = {
    set: $Enums.IjSeniority[]
  }

  export type CampaignInfojobsCreatepcdTypesInput = {
    set: $Enums.IjPcd[]
  }

  export type CampaignCreateNestedOneWithoutInfojobsConfigInput = {
    create?: XOR<CampaignCreateWithoutInfojobsConfigInput, CampaignUncheckedCreateWithoutInfojobsConfigInput>
    connectOrCreate?: CampaignCreateOrConnectWithoutInfojobsConfigInput
    connect?: CampaignWhereUniqueInput
  }

  export type NullableEnumBrazilStateFieldUpdateOperationsInput = {
    set?: $Enums.BrazilState | null
  }

  export type NullableEnumIjRadiusFieldUpdateOperationsInput = {
    set?: $Enums.IjRadius | null
  }

  export type NullableEnumIjSalaryFieldUpdateOperationsInput = {
    set?: $Enums.IjSalary | null
  }

  export type NullableEnumIjDatePostedFieldUpdateOperationsInput = {
    set?: $Enums.IjDatePosted | null
  }

  export type CampaignInfojobsUpdateworkModelsInput = {
    set?: $Enums.IjWorkModel[]
    push?: $Enums.IjWorkModel | $Enums.IjWorkModel[]
  }

  export type CampaignInfojobsUpdatejobAreasInput = {
    set?: $Enums.IjJobArea[]
    push?: $Enums.IjJobArea | $Enums.IjJobArea[]
  }

  export type CampaignInfojobsUpdatecontractTypesInput = {
    set?: $Enums.IjContract[]
    push?: $Enums.IjContract | $Enums.IjContract[]
  }

  export type CampaignInfojobsUpdateworkSchedulesInput = {
    set?: $Enums.IjSchedule[]
    push?: $Enums.IjSchedule | $Enums.IjSchedule[]
  }

  export type CampaignInfojobsUpdateseniorityLevelsInput = {
    set?: $Enums.IjSeniority[]
    push?: $Enums.IjSeniority | $Enums.IjSeniority[]
  }

  export type CampaignInfojobsUpdatepcdTypesInput = {
    set?: $Enums.IjPcd[]
    push?: $Enums.IjPcd | $Enums.IjPcd[]
  }

  export type CampaignUpdateOneWithoutInfojobsConfigNestedInput = {
    create?: XOR<CampaignCreateWithoutInfojobsConfigInput, CampaignUncheckedCreateWithoutInfojobsConfigInput>
    connectOrCreate?: CampaignCreateOrConnectWithoutInfojobsConfigInput
    upsert?: CampaignUpsertWithoutInfojobsConfigInput
    disconnect?: CampaignWhereInput | boolean
    delete?: CampaignWhereInput | boolean
    connect?: CampaignWhereUniqueInput
    update?: XOR<XOR<CampaignUpdateToOneWithWhereWithoutInfojobsConfigInput, CampaignUpdateWithoutInfojobsConfigInput>, CampaignUncheckedUpdateWithoutInfojobsConfigInput>
  }

  export type CampaignCreateNestedOneWithoutJobApplicationsInput = {
    create?: XOR<CampaignCreateWithoutJobApplicationsInput, CampaignUncheckedCreateWithoutJobApplicationsInput>
    connectOrCreate?: CampaignCreateOrConnectWithoutJobApplicationsInput
    connect?: CampaignWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutJobApplicationsInput = {
    create?: XOR<UserCreateWithoutJobApplicationsInput, UserUncheckedCreateWithoutJobApplicationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutJobApplicationsInput
    connect?: UserWhereUniqueInput
  }

  export type NullableEnumAppStatusFieldUpdateOperationsInput = {
    set?: $Enums.AppStatus | null
  }

  export type CampaignUpdateOneWithoutJobApplicationsNestedInput = {
    create?: XOR<CampaignCreateWithoutJobApplicationsInput, CampaignUncheckedCreateWithoutJobApplicationsInput>
    connectOrCreate?: CampaignCreateOrConnectWithoutJobApplicationsInput
    upsert?: CampaignUpsertWithoutJobApplicationsInput
    disconnect?: CampaignWhereInput | boolean
    delete?: CampaignWhereInput | boolean
    connect?: CampaignWhereUniqueInput
    update?: XOR<XOR<CampaignUpdateToOneWithWhereWithoutJobApplicationsInput, CampaignUpdateWithoutJobApplicationsInput>, CampaignUncheckedUpdateWithoutJobApplicationsInput>
  }

  export type UserUpdateOneWithoutJobApplicationsNestedInput = {
    create?: XOR<UserCreateWithoutJobApplicationsInput, UserUncheckedCreateWithoutJobApplicationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutJobApplicationsInput
    upsert?: UserUpsertWithoutJobApplicationsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutJobApplicationsInput, UserUpdateWithoutJobApplicationsInput>, UserUncheckedUpdateWithoutJobApplicationsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedEnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedUuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type NestedEnumTransactionTypeNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.TransactionType | EnumTransactionTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.TransactionType[] | ListEnumTransactionTypeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.TransactionType[] | ListEnumTransactionTypeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumTransactionTypeNullableFilter<$PrismaModel> | $Enums.TransactionType | null
  }

  export type NestedUuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedEnumTransactionTypeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TransactionType | EnumTransactionTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.TransactionType[] | ListEnumTransactionTypeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.TransactionType[] | ListEnumTransactionTypeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumTransactionTypeNullableWithAggregatesFilter<$PrismaModel> | $Enums.TransactionType | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumTransactionTypeNullableFilter<$PrismaModel>
    _max?: NestedEnumTransactionTypeNullableFilter<$PrismaModel>
  }

  export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type NestedUuidNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumPlatformNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.Platform | EnumPlatformFieldRefInput<$PrismaModel> | null
    in?: $Enums.Platform[] | ListEnumPlatformFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.Platform[] | ListEnumPlatformFieldRefInput<$PrismaModel> | null
    not?: NestedEnumPlatformNullableFilter<$PrismaModel> | $Enums.Platform | null
  }

  export type NestedUuidNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedEnumPlatformNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Platform | EnumPlatformFieldRefInput<$PrismaModel> | null
    in?: $Enums.Platform[] | ListEnumPlatformFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.Platform[] | ListEnumPlatformFieldRefInput<$PrismaModel> | null
    not?: NestedEnumPlatformNullableWithAggregatesFilter<$PrismaModel> | $Enums.Platform | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumPlatformNullableFilter<$PrismaModel>
    _max?: NestedEnumPlatformNullableFilter<$PrismaModel>
  }

  export type NestedEnumLinkedinSortNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.LinkedinSort | EnumLinkedinSortFieldRefInput<$PrismaModel> | null
    in?: $Enums.LinkedinSort[] | ListEnumLinkedinSortFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.LinkedinSort[] | ListEnumLinkedinSortFieldRefInput<$PrismaModel> | null
    not?: NestedEnumLinkedinSortNullableFilter<$PrismaModel> | $Enums.LinkedinSort | null
  }

  export type NestedEnumLinkedinDateNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.LinkedinDate | EnumLinkedinDateFieldRefInput<$PrismaModel> | null
    in?: $Enums.LinkedinDate[] | ListEnumLinkedinDateFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.LinkedinDate[] | ListEnumLinkedinDateFieldRefInput<$PrismaModel> | null
    not?: NestedEnumLinkedinDateNullableFilter<$PrismaModel> | $Enums.LinkedinDate | null
  }

  export type NestedEnumLinkedinSortNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LinkedinSort | EnumLinkedinSortFieldRefInput<$PrismaModel> | null
    in?: $Enums.LinkedinSort[] | ListEnumLinkedinSortFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.LinkedinSort[] | ListEnumLinkedinSortFieldRefInput<$PrismaModel> | null
    not?: NestedEnumLinkedinSortNullableWithAggregatesFilter<$PrismaModel> | $Enums.LinkedinSort | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumLinkedinSortNullableFilter<$PrismaModel>
    _max?: NestedEnumLinkedinSortNullableFilter<$PrismaModel>
  }

  export type NestedEnumLinkedinDateNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LinkedinDate | EnumLinkedinDateFieldRefInput<$PrismaModel> | null
    in?: $Enums.LinkedinDate[] | ListEnumLinkedinDateFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.LinkedinDate[] | ListEnumLinkedinDateFieldRefInput<$PrismaModel> | null
    not?: NestedEnumLinkedinDateNullableWithAggregatesFilter<$PrismaModel> | $Enums.LinkedinDate | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumLinkedinDateNullableFilter<$PrismaModel>
    _max?: NestedEnumLinkedinDateNullableFilter<$PrismaModel>
  }

  export type NestedEnumBrazilStateNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.BrazilState | EnumBrazilStateFieldRefInput<$PrismaModel> | null
    in?: $Enums.BrazilState[] | ListEnumBrazilStateFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.BrazilState[] | ListEnumBrazilStateFieldRefInput<$PrismaModel> | null
    not?: NestedEnumBrazilStateNullableFilter<$PrismaModel> | $Enums.BrazilState | null
  }

  export type NestedEnumIjRadiusNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.IjRadius | EnumIjRadiusFieldRefInput<$PrismaModel> | null
    in?: $Enums.IjRadius[] | ListEnumIjRadiusFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.IjRadius[] | ListEnumIjRadiusFieldRefInput<$PrismaModel> | null
    not?: NestedEnumIjRadiusNullableFilter<$PrismaModel> | $Enums.IjRadius | null
  }

  export type NestedEnumIjSalaryNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.IjSalary | EnumIjSalaryFieldRefInput<$PrismaModel> | null
    in?: $Enums.IjSalary[] | ListEnumIjSalaryFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.IjSalary[] | ListEnumIjSalaryFieldRefInput<$PrismaModel> | null
    not?: NestedEnumIjSalaryNullableFilter<$PrismaModel> | $Enums.IjSalary | null
  }

  export type NestedEnumIjDatePostedNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.IjDatePosted | EnumIjDatePostedFieldRefInput<$PrismaModel> | null
    in?: $Enums.IjDatePosted[] | ListEnumIjDatePostedFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.IjDatePosted[] | ListEnumIjDatePostedFieldRefInput<$PrismaModel> | null
    not?: NestedEnumIjDatePostedNullableFilter<$PrismaModel> | $Enums.IjDatePosted | null
  }

  export type NestedEnumBrazilStateNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BrazilState | EnumBrazilStateFieldRefInput<$PrismaModel> | null
    in?: $Enums.BrazilState[] | ListEnumBrazilStateFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.BrazilState[] | ListEnumBrazilStateFieldRefInput<$PrismaModel> | null
    not?: NestedEnumBrazilStateNullableWithAggregatesFilter<$PrismaModel> | $Enums.BrazilState | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumBrazilStateNullableFilter<$PrismaModel>
    _max?: NestedEnumBrazilStateNullableFilter<$PrismaModel>
  }

  export type NestedEnumIjRadiusNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.IjRadius | EnumIjRadiusFieldRefInput<$PrismaModel> | null
    in?: $Enums.IjRadius[] | ListEnumIjRadiusFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.IjRadius[] | ListEnumIjRadiusFieldRefInput<$PrismaModel> | null
    not?: NestedEnumIjRadiusNullableWithAggregatesFilter<$PrismaModel> | $Enums.IjRadius | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumIjRadiusNullableFilter<$PrismaModel>
    _max?: NestedEnumIjRadiusNullableFilter<$PrismaModel>
  }

  export type NestedEnumIjSalaryNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.IjSalary | EnumIjSalaryFieldRefInput<$PrismaModel> | null
    in?: $Enums.IjSalary[] | ListEnumIjSalaryFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.IjSalary[] | ListEnumIjSalaryFieldRefInput<$PrismaModel> | null
    not?: NestedEnumIjSalaryNullableWithAggregatesFilter<$PrismaModel> | $Enums.IjSalary | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumIjSalaryNullableFilter<$PrismaModel>
    _max?: NestedEnumIjSalaryNullableFilter<$PrismaModel>
  }

  export type NestedEnumIjDatePostedNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.IjDatePosted | EnumIjDatePostedFieldRefInput<$PrismaModel> | null
    in?: $Enums.IjDatePosted[] | ListEnumIjDatePostedFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.IjDatePosted[] | ListEnumIjDatePostedFieldRefInput<$PrismaModel> | null
    not?: NestedEnumIjDatePostedNullableWithAggregatesFilter<$PrismaModel> | $Enums.IjDatePosted | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumIjDatePostedNullableFilter<$PrismaModel>
    _max?: NestedEnumIjDatePostedNullableFilter<$PrismaModel>
  }

  export type NestedEnumAppStatusNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.AppStatus | EnumAppStatusFieldRefInput<$PrismaModel> | null
    in?: $Enums.AppStatus[] | ListEnumAppStatusFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.AppStatus[] | ListEnumAppStatusFieldRefInput<$PrismaModel> | null
    not?: NestedEnumAppStatusNullableFilter<$PrismaModel> | $Enums.AppStatus | null
  }

  export type NestedEnumAppStatusNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AppStatus | EnumAppStatusFieldRefInput<$PrismaModel> | null
    in?: $Enums.AppStatus[] | ListEnumAppStatusFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.AppStatus[] | ListEnumAppStatusFieldRefInput<$PrismaModel> | null
    not?: NestedEnumAppStatusNullableWithAggregatesFilter<$PrismaModel> | $Enums.AppStatus | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumAppStatusNullableFilter<$PrismaModel>
    _max?: NestedEnumAppStatusNullableFilter<$PrismaModel>
  }

  export type ResumeCreateWithoutUserInput = {
    id?: string
    title?: string | null
    personalInfo?: NullableJsonNullValueInput | InputJsonValue
    education?: NullableJsonNullValueInput | InputJsonValue
    experience?: NullableJsonNullValueInput | InputJsonValue
    skills?: NullableJsonNullValueInput | InputJsonValue
    isDefault?: boolean | null
    createdAt?: Date | string | null
    campaigns?: CampaignCreateNestedManyWithoutResumeInput
  }

  export type ResumeUncheckedCreateWithoutUserInput = {
    id?: string
    title?: string | null
    personalInfo?: NullableJsonNullValueInput | InputJsonValue
    education?: NullableJsonNullValueInput | InputJsonValue
    experience?: NullableJsonNullValueInput | InputJsonValue
    skills?: NullableJsonNullValueInput | InputJsonValue
    isDefault?: boolean | null
    createdAt?: Date | string | null
    campaigns?: CampaignUncheckedCreateNestedManyWithoutResumeInput
  }

  export type ResumeCreateOrConnectWithoutUserInput = {
    where: ResumeWhereUniqueInput
    create: XOR<ResumeCreateWithoutUserInput, ResumeUncheckedCreateWithoutUserInput>
  }

  export type ResumeCreateManyUserInputEnvelope = {
    data: ResumeCreateManyUserInput | ResumeCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type CampaignCreateWithoutUserInput = {
    id?: string
    name?: string | null
    platform?: $Enums.Platform | null
    status?: string | null
    dailyLimit?: number | null
    createdAt?: Date | string | null
    resume?: ResumeCreateNestedOneWithoutCampaignsInput
    linkedinConfig?: CampaignLinkedinCreateNestedOneWithoutCampaignInput
    infojobsConfig?: CampaignInfojobsCreateNestedOneWithoutCampaignInput
    jobApplications?: JobApplicationCreateNestedManyWithoutCampaignInput
  }

  export type CampaignUncheckedCreateWithoutUserInput = {
    id?: string
    resumeId?: string | null
    name?: string | null
    platform?: $Enums.Platform | null
    status?: string | null
    dailyLimit?: number | null
    createdAt?: Date | string | null
    linkedinConfig?: CampaignLinkedinUncheckedCreateNestedOneWithoutCampaignInput
    infojobsConfig?: CampaignInfojobsUncheckedCreateNestedOneWithoutCampaignInput
    jobApplications?: JobApplicationUncheckedCreateNestedManyWithoutCampaignInput
  }

  export type CampaignCreateOrConnectWithoutUserInput = {
    where: CampaignWhereUniqueInput
    create: XOR<CampaignCreateWithoutUserInput, CampaignUncheckedCreateWithoutUserInput>
  }

  export type CampaignCreateManyUserInputEnvelope = {
    data: CampaignCreateManyUserInput | CampaignCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type JobApplicationCreateWithoutUserInput = {
    id?: string
    platform?: $Enums.Platform | null
    companyName?: string | null
    jobTitle?: string | null
    jobUrl?: string | null
    status?: $Enums.AppStatus | null
    errorLog?: string | null
    appliedAt?: Date | string | null
    createdAt?: Date | string | null
    campaign?: CampaignCreateNestedOneWithoutJobApplicationsInput
  }

  export type JobApplicationUncheckedCreateWithoutUserInput = {
    id?: string
    campaignId?: string | null
    platform?: $Enums.Platform | null
    companyName?: string | null
    jobTitle?: string | null
    jobUrl?: string | null
    status?: $Enums.AppStatus | null
    errorLog?: string | null
    appliedAt?: Date | string | null
    createdAt?: Date | string | null
  }

  export type JobApplicationCreateOrConnectWithoutUserInput = {
    where: JobApplicationWhereUniqueInput
    create: XOR<JobApplicationCreateWithoutUserInput, JobApplicationUncheckedCreateWithoutUserInput>
  }

  export type JobApplicationCreateManyUserInputEnvelope = {
    data: JobApplicationCreateManyUserInput | JobApplicationCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type TransactionCreateWithoutUserInput = {
    id?: string
    amount?: number | null
    type?: $Enums.TransactionType | null
    description?: string | null
    created_at?: Date | string | null
    stripeCustomer?: UserCreateNestedOneWithoutStripeTransactionInput
  }

  export type TransactionUncheckedCreateWithoutUserInput = {
    id?: string
    amount?: number | null
    type?: $Enums.TransactionType | null
    reference_id?: string | null
    description?: string | null
    created_at?: Date | string | null
  }

  export type TransactionCreateOrConnectWithoutUserInput = {
    where: TransactionWhereUniqueInput
    create: XOR<TransactionCreateWithoutUserInput, TransactionUncheckedCreateWithoutUserInput>
  }

  export type TransactionCreateManyUserInputEnvelope = {
    data: TransactionCreateManyUserInput | TransactionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type TransactionCreateWithoutStripeCustomerInput = {
    id?: string
    amount?: number | null
    type?: $Enums.TransactionType | null
    description?: string | null
    created_at?: Date | string | null
    user?: UserCreateNestedOneWithoutTransactionInput
  }

  export type TransactionUncheckedCreateWithoutStripeCustomerInput = {
    id?: string
    userId?: string | null
    amount?: number | null
    type?: $Enums.TransactionType | null
    description?: string | null
    created_at?: Date | string | null
  }

  export type TransactionCreateOrConnectWithoutStripeCustomerInput = {
    where: TransactionWhereUniqueInput
    create: XOR<TransactionCreateWithoutStripeCustomerInput, TransactionUncheckedCreateWithoutStripeCustomerInput>
  }

  export type TransactionCreateManyStripeCustomerInputEnvelope = {
    data: TransactionCreateManyStripeCustomerInput | TransactionCreateManyStripeCustomerInput[]
    skipDuplicates?: boolean
  }

  export type ResumeUpsertWithWhereUniqueWithoutUserInput = {
    where: ResumeWhereUniqueInput
    update: XOR<ResumeUpdateWithoutUserInput, ResumeUncheckedUpdateWithoutUserInput>
    create: XOR<ResumeCreateWithoutUserInput, ResumeUncheckedCreateWithoutUserInput>
  }

  export type ResumeUpdateWithWhereUniqueWithoutUserInput = {
    where: ResumeWhereUniqueInput
    data: XOR<ResumeUpdateWithoutUserInput, ResumeUncheckedUpdateWithoutUserInput>
  }

  export type ResumeUpdateManyWithWhereWithoutUserInput = {
    where: ResumeScalarWhereInput
    data: XOR<ResumeUpdateManyMutationInput, ResumeUncheckedUpdateManyWithoutUserInput>
  }

  export type ResumeScalarWhereInput = {
    AND?: ResumeScalarWhereInput | ResumeScalarWhereInput[]
    OR?: ResumeScalarWhereInput[]
    NOT?: ResumeScalarWhereInput | ResumeScalarWhereInput[]
    id?: UuidFilter<"Resume"> | string
    userId?: StringNullableFilter<"Resume"> | string | null
    title?: StringNullableFilter<"Resume"> | string | null
    personalInfo?: JsonNullableFilter<"Resume">
    education?: JsonNullableFilter<"Resume">
    experience?: JsonNullableFilter<"Resume">
    skills?: JsonNullableFilter<"Resume">
    isDefault?: BoolNullableFilter<"Resume"> | boolean | null
    createdAt?: DateTimeNullableFilter<"Resume"> | Date | string | null
  }

  export type CampaignUpsertWithWhereUniqueWithoutUserInput = {
    where: CampaignWhereUniqueInput
    update: XOR<CampaignUpdateWithoutUserInput, CampaignUncheckedUpdateWithoutUserInput>
    create: XOR<CampaignCreateWithoutUserInput, CampaignUncheckedCreateWithoutUserInput>
  }

  export type CampaignUpdateWithWhereUniqueWithoutUserInput = {
    where: CampaignWhereUniqueInput
    data: XOR<CampaignUpdateWithoutUserInput, CampaignUncheckedUpdateWithoutUserInput>
  }

  export type CampaignUpdateManyWithWhereWithoutUserInput = {
    where: CampaignScalarWhereInput
    data: XOR<CampaignUpdateManyMutationInput, CampaignUncheckedUpdateManyWithoutUserInput>
  }

  export type CampaignScalarWhereInput = {
    AND?: CampaignScalarWhereInput | CampaignScalarWhereInput[]
    OR?: CampaignScalarWhereInput[]
    NOT?: CampaignScalarWhereInput | CampaignScalarWhereInput[]
    id?: UuidFilter<"Campaign"> | string
    resumeId?: UuidNullableFilter<"Campaign"> | string | null
    userId?: StringNullableFilter<"Campaign"> | string | null
    name?: StringNullableFilter<"Campaign"> | string | null
    platform?: EnumPlatformNullableFilter<"Campaign"> | $Enums.Platform | null
    status?: StringNullableFilter<"Campaign"> | string | null
    dailyLimit?: IntNullableFilter<"Campaign"> | number | null
    createdAt?: DateTimeNullableFilter<"Campaign"> | Date | string | null
  }

  export type JobApplicationUpsertWithWhereUniqueWithoutUserInput = {
    where: JobApplicationWhereUniqueInput
    update: XOR<JobApplicationUpdateWithoutUserInput, JobApplicationUncheckedUpdateWithoutUserInput>
    create: XOR<JobApplicationCreateWithoutUserInput, JobApplicationUncheckedCreateWithoutUserInput>
  }

  export type JobApplicationUpdateWithWhereUniqueWithoutUserInput = {
    where: JobApplicationWhereUniqueInput
    data: XOR<JobApplicationUpdateWithoutUserInput, JobApplicationUncheckedUpdateWithoutUserInput>
  }

  export type JobApplicationUpdateManyWithWhereWithoutUserInput = {
    where: JobApplicationScalarWhereInput
    data: XOR<JobApplicationUpdateManyMutationInput, JobApplicationUncheckedUpdateManyWithoutUserInput>
  }

  export type JobApplicationScalarWhereInput = {
    AND?: JobApplicationScalarWhereInput | JobApplicationScalarWhereInput[]
    OR?: JobApplicationScalarWhereInput[]
    NOT?: JobApplicationScalarWhereInput | JobApplicationScalarWhereInput[]
    id?: UuidFilter<"JobApplication"> | string
    campaignId?: UuidNullableFilter<"JobApplication"> | string | null
    userId?: StringNullableFilter<"JobApplication"> | string | null
    platform?: EnumPlatformNullableFilter<"JobApplication"> | $Enums.Platform | null
    companyName?: StringNullableFilter<"JobApplication"> | string | null
    jobTitle?: StringNullableFilter<"JobApplication"> | string | null
    jobUrl?: StringNullableFilter<"JobApplication"> | string | null
    status?: EnumAppStatusNullableFilter<"JobApplication"> | $Enums.AppStatus | null
    errorLog?: StringNullableFilter<"JobApplication"> | string | null
    appliedAt?: DateTimeNullableFilter<"JobApplication"> | Date | string | null
    createdAt?: DateTimeNullableFilter<"JobApplication"> | Date | string | null
  }

  export type TransactionUpsertWithWhereUniqueWithoutUserInput = {
    where: TransactionWhereUniqueInput
    update: XOR<TransactionUpdateWithoutUserInput, TransactionUncheckedUpdateWithoutUserInput>
    create: XOR<TransactionCreateWithoutUserInput, TransactionUncheckedCreateWithoutUserInput>
  }

  export type TransactionUpdateWithWhereUniqueWithoutUserInput = {
    where: TransactionWhereUniqueInput
    data: XOR<TransactionUpdateWithoutUserInput, TransactionUncheckedUpdateWithoutUserInput>
  }

  export type TransactionUpdateManyWithWhereWithoutUserInput = {
    where: TransactionScalarWhereInput
    data: XOR<TransactionUpdateManyMutationInput, TransactionUncheckedUpdateManyWithoutUserInput>
  }

  export type TransactionScalarWhereInput = {
    AND?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
    OR?: TransactionScalarWhereInput[]
    NOT?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
    id?: UuidFilter<"Transaction"> | string
    userId?: StringNullableFilter<"Transaction"> | string | null
    amount?: IntNullableFilter<"Transaction"> | number | null
    type?: EnumTransactionTypeNullableFilter<"Transaction"> | $Enums.TransactionType | null
    reference_id?: StringNullableFilter<"Transaction"> | string | null
    description?: StringNullableFilter<"Transaction"> | string | null
    created_at?: DateTimeNullableFilter<"Transaction"> | Date | string | null
  }

  export type TransactionUpsertWithWhereUniqueWithoutStripeCustomerInput = {
    where: TransactionWhereUniqueInput
    update: XOR<TransactionUpdateWithoutStripeCustomerInput, TransactionUncheckedUpdateWithoutStripeCustomerInput>
    create: XOR<TransactionCreateWithoutStripeCustomerInput, TransactionUncheckedCreateWithoutStripeCustomerInput>
  }

  export type TransactionUpdateWithWhereUniqueWithoutStripeCustomerInput = {
    where: TransactionWhereUniqueInput
    data: XOR<TransactionUpdateWithoutStripeCustomerInput, TransactionUncheckedUpdateWithoutStripeCustomerInput>
  }

  export type TransactionUpdateManyWithWhereWithoutStripeCustomerInput = {
    where: TransactionScalarWhereInput
    data: XOR<TransactionUpdateManyMutationInput, TransactionUncheckedUpdateManyWithoutStripeCustomerInput>
  }

  export type UserCreateWithoutTransactionInput = {
    id: string
    email: string
    password?: string | null
    role?: $Enums.UserRole
    stripeCustomerId?: string | null
    credits?: number | null
    planTier?: string | null
    createdAt?: Date | string | null
    resumes?: ResumeCreateNestedManyWithoutUserInput
    campaigns?: CampaignCreateNestedManyWithoutUserInput
    jobApplications?: JobApplicationCreateNestedManyWithoutUserInput
    stripeTransaction?: TransactionCreateNestedManyWithoutStripeCustomerInput
  }

  export type UserUncheckedCreateWithoutTransactionInput = {
    id: string
    email: string
    password?: string | null
    role?: $Enums.UserRole
    stripeCustomerId?: string | null
    credits?: number | null
    planTier?: string | null
    createdAt?: Date | string | null
    resumes?: ResumeUncheckedCreateNestedManyWithoutUserInput
    campaigns?: CampaignUncheckedCreateNestedManyWithoutUserInput
    jobApplications?: JobApplicationUncheckedCreateNestedManyWithoutUserInput
    stripeTransaction?: TransactionUncheckedCreateNestedManyWithoutStripeCustomerInput
  }

  export type UserCreateOrConnectWithoutTransactionInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTransactionInput, UserUncheckedCreateWithoutTransactionInput>
  }

  export type UserCreateWithoutStripeTransactionInput = {
    id: string
    email: string
    password?: string | null
    role?: $Enums.UserRole
    stripeCustomerId?: string | null
    credits?: number | null
    planTier?: string | null
    createdAt?: Date | string | null
    resumes?: ResumeCreateNestedManyWithoutUserInput
    campaigns?: CampaignCreateNestedManyWithoutUserInput
    jobApplications?: JobApplicationCreateNestedManyWithoutUserInput
    transaction?: TransactionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutStripeTransactionInput = {
    id: string
    email: string
    password?: string | null
    role?: $Enums.UserRole
    stripeCustomerId?: string | null
    credits?: number | null
    planTier?: string | null
    createdAt?: Date | string | null
    resumes?: ResumeUncheckedCreateNestedManyWithoutUserInput
    campaigns?: CampaignUncheckedCreateNestedManyWithoutUserInput
    jobApplications?: JobApplicationUncheckedCreateNestedManyWithoutUserInput
    transaction?: TransactionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutStripeTransactionInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutStripeTransactionInput, UserUncheckedCreateWithoutStripeTransactionInput>
  }

  export type UserUpsertWithoutTransactionInput = {
    update: XOR<UserUpdateWithoutTransactionInput, UserUncheckedUpdateWithoutTransactionInput>
    create: XOR<UserCreateWithoutTransactionInput, UserUncheckedCreateWithoutTransactionInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutTransactionInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutTransactionInput, UserUncheckedUpdateWithoutTransactionInput>
  }

  export type UserUpdateWithoutTransactionInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    credits?: NullableIntFieldUpdateOperationsInput | number | null
    planTier?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resumes?: ResumeUpdateManyWithoutUserNestedInput
    campaigns?: CampaignUpdateManyWithoutUserNestedInput
    jobApplications?: JobApplicationUpdateManyWithoutUserNestedInput
    stripeTransaction?: TransactionUpdateManyWithoutStripeCustomerNestedInput
  }

  export type UserUncheckedUpdateWithoutTransactionInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    credits?: NullableIntFieldUpdateOperationsInput | number | null
    planTier?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resumes?: ResumeUncheckedUpdateManyWithoutUserNestedInput
    campaigns?: CampaignUncheckedUpdateManyWithoutUserNestedInput
    jobApplications?: JobApplicationUncheckedUpdateManyWithoutUserNestedInput
    stripeTransaction?: TransactionUncheckedUpdateManyWithoutStripeCustomerNestedInput
  }

  export type UserUpsertWithoutStripeTransactionInput = {
    update: XOR<UserUpdateWithoutStripeTransactionInput, UserUncheckedUpdateWithoutStripeTransactionInput>
    create: XOR<UserCreateWithoutStripeTransactionInput, UserUncheckedCreateWithoutStripeTransactionInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutStripeTransactionInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutStripeTransactionInput, UserUncheckedUpdateWithoutStripeTransactionInput>
  }

  export type UserUpdateWithoutStripeTransactionInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    credits?: NullableIntFieldUpdateOperationsInput | number | null
    planTier?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resumes?: ResumeUpdateManyWithoutUserNestedInput
    campaigns?: CampaignUpdateManyWithoutUserNestedInput
    jobApplications?: JobApplicationUpdateManyWithoutUserNestedInput
    transaction?: TransactionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutStripeTransactionInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    credits?: NullableIntFieldUpdateOperationsInput | number | null
    planTier?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resumes?: ResumeUncheckedUpdateManyWithoutUserNestedInput
    campaigns?: CampaignUncheckedUpdateManyWithoutUserNestedInput
    jobApplications?: JobApplicationUncheckedUpdateManyWithoutUserNestedInput
    transaction?: TransactionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutResumesInput = {
    id: string
    email: string
    password?: string | null
    role?: $Enums.UserRole
    stripeCustomerId?: string | null
    credits?: number | null
    planTier?: string | null
    createdAt?: Date | string | null
    campaigns?: CampaignCreateNestedManyWithoutUserInput
    jobApplications?: JobApplicationCreateNestedManyWithoutUserInput
    transaction?: TransactionCreateNestedManyWithoutUserInput
    stripeTransaction?: TransactionCreateNestedManyWithoutStripeCustomerInput
  }

  export type UserUncheckedCreateWithoutResumesInput = {
    id: string
    email: string
    password?: string | null
    role?: $Enums.UserRole
    stripeCustomerId?: string | null
    credits?: number | null
    planTier?: string | null
    createdAt?: Date | string | null
    campaigns?: CampaignUncheckedCreateNestedManyWithoutUserInput
    jobApplications?: JobApplicationUncheckedCreateNestedManyWithoutUserInput
    transaction?: TransactionUncheckedCreateNestedManyWithoutUserInput
    stripeTransaction?: TransactionUncheckedCreateNestedManyWithoutStripeCustomerInput
  }

  export type UserCreateOrConnectWithoutResumesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutResumesInput, UserUncheckedCreateWithoutResumesInput>
  }

  export type CampaignCreateWithoutResumeInput = {
    id?: string
    name?: string | null
    platform?: $Enums.Platform | null
    status?: string | null
    dailyLimit?: number | null
    createdAt?: Date | string | null
    user?: UserCreateNestedOneWithoutCampaignsInput
    linkedinConfig?: CampaignLinkedinCreateNestedOneWithoutCampaignInput
    infojobsConfig?: CampaignInfojobsCreateNestedOneWithoutCampaignInput
    jobApplications?: JobApplicationCreateNestedManyWithoutCampaignInput
  }

  export type CampaignUncheckedCreateWithoutResumeInput = {
    id?: string
    userId?: string | null
    name?: string | null
    platform?: $Enums.Platform | null
    status?: string | null
    dailyLimit?: number | null
    createdAt?: Date | string | null
    linkedinConfig?: CampaignLinkedinUncheckedCreateNestedOneWithoutCampaignInput
    infojobsConfig?: CampaignInfojobsUncheckedCreateNestedOneWithoutCampaignInput
    jobApplications?: JobApplicationUncheckedCreateNestedManyWithoutCampaignInput
  }

  export type CampaignCreateOrConnectWithoutResumeInput = {
    where: CampaignWhereUniqueInput
    create: XOR<CampaignCreateWithoutResumeInput, CampaignUncheckedCreateWithoutResumeInput>
  }

  export type CampaignCreateManyResumeInputEnvelope = {
    data: CampaignCreateManyResumeInput | CampaignCreateManyResumeInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutResumesInput = {
    update: XOR<UserUpdateWithoutResumesInput, UserUncheckedUpdateWithoutResumesInput>
    create: XOR<UserCreateWithoutResumesInput, UserUncheckedCreateWithoutResumesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutResumesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutResumesInput, UserUncheckedUpdateWithoutResumesInput>
  }

  export type UserUpdateWithoutResumesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    credits?: NullableIntFieldUpdateOperationsInput | number | null
    planTier?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    campaigns?: CampaignUpdateManyWithoutUserNestedInput
    jobApplications?: JobApplicationUpdateManyWithoutUserNestedInput
    transaction?: TransactionUpdateManyWithoutUserNestedInput
    stripeTransaction?: TransactionUpdateManyWithoutStripeCustomerNestedInput
  }

  export type UserUncheckedUpdateWithoutResumesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    credits?: NullableIntFieldUpdateOperationsInput | number | null
    planTier?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    campaigns?: CampaignUncheckedUpdateManyWithoutUserNestedInput
    jobApplications?: JobApplicationUncheckedUpdateManyWithoutUserNestedInput
    transaction?: TransactionUncheckedUpdateManyWithoutUserNestedInput
    stripeTransaction?: TransactionUncheckedUpdateManyWithoutStripeCustomerNestedInput
  }

  export type CampaignUpsertWithWhereUniqueWithoutResumeInput = {
    where: CampaignWhereUniqueInput
    update: XOR<CampaignUpdateWithoutResumeInput, CampaignUncheckedUpdateWithoutResumeInput>
    create: XOR<CampaignCreateWithoutResumeInput, CampaignUncheckedCreateWithoutResumeInput>
  }

  export type CampaignUpdateWithWhereUniqueWithoutResumeInput = {
    where: CampaignWhereUniqueInput
    data: XOR<CampaignUpdateWithoutResumeInput, CampaignUncheckedUpdateWithoutResumeInput>
  }

  export type CampaignUpdateManyWithWhereWithoutResumeInput = {
    where: CampaignScalarWhereInput
    data: XOR<CampaignUpdateManyMutationInput, CampaignUncheckedUpdateManyWithoutResumeInput>
  }

  export type ResumeCreateWithoutCampaignsInput = {
    id?: string
    title?: string | null
    personalInfo?: NullableJsonNullValueInput | InputJsonValue
    education?: NullableJsonNullValueInput | InputJsonValue
    experience?: NullableJsonNullValueInput | InputJsonValue
    skills?: NullableJsonNullValueInput | InputJsonValue
    isDefault?: boolean | null
    createdAt?: Date | string | null
    user?: UserCreateNestedOneWithoutResumesInput
  }

  export type ResumeUncheckedCreateWithoutCampaignsInput = {
    id?: string
    userId?: string | null
    title?: string | null
    personalInfo?: NullableJsonNullValueInput | InputJsonValue
    education?: NullableJsonNullValueInput | InputJsonValue
    experience?: NullableJsonNullValueInput | InputJsonValue
    skills?: NullableJsonNullValueInput | InputJsonValue
    isDefault?: boolean | null
    createdAt?: Date | string | null
  }

  export type ResumeCreateOrConnectWithoutCampaignsInput = {
    where: ResumeWhereUniqueInput
    create: XOR<ResumeCreateWithoutCampaignsInput, ResumeUncheckedCreateWithoutCampaignsInput>
  }

  export type UserCreateWithoutCampaignsInput = {
    id: string
    email: string
    password?: string | null
    role?: $Enums.UserRole
    stripeCustomerId?: string | null
    credits?: number | null
    planTier?: string | null
    createdAt?: Date | string | null
    resumes?: ResumeCreateNestedManyWithoutUserInput
    jobApplications?: JobApplicationCreateNestedManyWithoutUserInput
    transaction?: TransactionCreateNestedManyWithoutUserInput
    stripeTransaction?: TransactionCreateNestedManyWithoutStripeCustomerInput
  }

  export type UserUncheckedCreateWithoutCampaignsInput = {
    id: string
    email: string
    password?: string | null
    role?: $Enums.UserRole
    stripeCustomerId?: string | null
    credits?: number | null
    planTier?: string | null
    createdAt?: Date | string | null
    resumes?: ResumeUncheckedCreateNestedManyWithoutUserInput
    jobApplications?: JobApplicationUncheckedCreateNestedManyWithoutUserInput
    transaction?: TransactionUncheckedCreateNestedManyWithoutUserInput
    stripeTransaction?: TransactionUncheckedCreateNestedManyWithoutStripeCustomerInput
  }

  export type UserCreateOrConnectWithoutCampaignsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutCampaignsInput, UserUncheckedCreateWithoutCampaignsInput>
  }

  export type CampaignLinkedinCreateWithoutCampaignInput = {
    id?: string
    searchTerms?: string | null
    locationTerm?: string | null
    sortBy?: $Enums.LinkedinSort | null
    datePosted?: $Enums.LinkedinDate | null
    expLevel?: CampaignLinkedinCreateexpLevelInput | $Enums.LinkedinExp[]
    jobType?: CampaignLinkedinCreatejobTypeInput | $Enums.LinkedinJobType[]
    remoteFilter?: CampaignLinkedinCreateremoteFilterInput | $Enums.LinkedinRemote[]
  }

  export type CampaignLinkedinUncheckedCreateWithoutCampaignInput = {
    id?: string
    searchTerms?: string | null
    locationTerm?: string | null
    sortBy?: $Enums.LinkedinSort | null
    datePosted?: $Enums.LinkedinDate | null
    expLevel?: CampaignLinkedinCreateexpLevelInput | $Enums.LinkedinExp[]
    jobType?: CampaignLinkedinCreatejobTypeInput | $Enums.LinkedinJobType[]
    remoteFilter?: CampaignLinkedinCreateremoteFilterInput | $Enums.LinkedinRemote[]
  }

  export type CampaignLinkedinCreateOrConnectWithoutCampaignInput = {
    where: CampaignLinkedinWhereUniqueInput
    create: XOR<CampaignLinkedinCreateWithoutCampaignInput, CampaignLinkedinUncheckedCreateWithoutCampaignInput>
  }

  export type CampaignInfojobsCreateWithoutCampaignInput = {
    id?: string
    searchTerms?: string | null
    locationState?: $Enums.BrazilState | null
    kmDeVoce?: $Enums.IjRadius | null
    salaryFilter?: $Enums.IjSalary | null
    datePosted?: $Enums.IjDatePosted | null
    workModels?: CampaignInfojobsCreateworkModelsInput | $Enums.IjWorkModel[]
    jobAreas?: CampaignInfojobsCreatejobAreasInput | $Enums.IjJobArea[]
    contractTypes?: CampaignInfojobsCreatecontractTypesInput | $Enums.IjContract[]
    workSchedules?: CampaignInfojobsCreateworkSchedulesInput | $Enums.IjSchedule[]
    seniorityLevels?: CampaignInfojobsCreateseniorityLevelsInput | $Enums.IjSeniority[]
    pcdTypes?: CampaignInfojobsCreatepcdTypesInput | $Enums.IjPcd[]
  }

  export type CampaignInfojobsUncheckedCreateWithoutCampaignInput = {
    id?: string
    searchTerms?: string | null
    locationState?: $Enums.BrazilState | null
    kmDeVoce?: $Enums.IjRadius | null
    salaryFilter?: $Enums.IjSalary | null
    datePosted?: $Enums.IjDatePosted | null
    workModels?: CampaignInfojobsCreateworkModelsInput | $Enums.IjWorkModel[]
    jobAreas?: CampaignInfojobsCreatejobAreasInput | $Enums.IjJobArea[]
    contractTypes?: CampaignInfojobsCreatecontractTypesInput | $Enums.IjContract[]
    workSchedules?: CampaignInfojobsCreateworkSchedulesInput | $Enums.IjSchedule[]
    seniorityLevels?: CampaignInfojobsCreateseniorityLevelsInput | $Enums.IjSeniority[]
    pcdTypes?: CampaignInfojobsCreatepcdTypesInput | $Enums.IjPcd[]
  }

  export type CampaignInfojobsCreateOrConnectWithoutCampaignInput = {
    where: CampaignInfojobsWhereUniqueInput
    create: XOR<CampaignInfojobsCreateWithoutCampaignInput, CampaignInfojobsUncheckedCreateWithoutCampaignInput>
  }

  export type JobApplicationCreateWithoutCampaignInput = {
    id?: string
    platform?: $Enums.Platform | null
    companyName?: string | null
    jobTitle?: string | null
    jobUrl?: string | null
    status?: $Enums.AppStatus | null
    errorLog?: string | null
    appliedAt?: Date | string | null
    createdAt?: Date | string | null
    user?: UserCreateNestedOneWithoutJobApplicationsInput
  }

  export type JobApplicationUncheckedCreateWithoutCampaignInput = {
    id?: string
    userId?: string | null
    platform?: $Enums.Platform | null
    companyName?: string | null
    jobTitle?: string | null
    jobUrl?: string | null
    status?: $Enums.AppStatus | null
    errorLog?: string | null
    appliedAt?: Date | string | null
    createdAt?: Date | string | null
  }

  export type JobApplicationCreateOrConnectWithoutCampaignInput = {
    where: JobApplicationWhereUniqueInput
    create: XOR<JobApplicationCreateWithoutCampaignInput, JobApplicationUncheckedCreateWithoutCampaignInput>
  }

  export type JobApplicationCreateManyCampaignInputEnvelope = {
    data: JobApplicationCreateManyCampaignInput | JobApplicationCreateManyCampaignInput[]
    skipDuplicates?: boolean
  }

  export type ResumeUpsertWithoutCampaignsInput = {
    update: XOR<ResumeUpdateWithoutCampaignsInput, ResumeUncheckedUpdateWithoutCampaignsInput>
    create: XOR<ResumeCreateWithoutCampaignsInput, ResumeUncheckedCreateWithoutCampaignsInput>
    where?: ResumeWhereInput
  }

  export type ResumeUpdateToOneWithWhereWithoutCampaignsInput = {
    where?: ResumeWhereInput
    data: XOR<ResumeUpdateWithoutCampaignsInput, ResumeUncheckedUpdateWithoutCampaignsInput>
  }

  export type ResumeUpdateWithoutCampaignsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    personalInfo?: NullableJsonNullValueInput | InputJsonValue
    education?: NullableJsonNullValueInput | InputJsonValue
    experience?: NullableJsonNullValueInput | InputJsonValue
    skills?: NullableJsonNullValueInput | InputJsonValue
    isDefault?: NullableBoolFieldUpdateOperationsInput | boolean | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneWithoutResumesNestedInput
  }

  export type ResumeUncheckedUpdateWithoutCampaignsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: NullableStringFieldUpdateOperationsInput | string | null
    personalInfo?: NullableJsonNullValueInput | InputJsonValue
    education?: NullableJsonNullValueInput | InputJsonValue
    experience?: NullableJsonNullValueInput | InputJsonValue
    skills?: NullableJsonNullValueInput | InputJsonValue
    isDefault?: NullableBoolFieldUpdateOperationsInput | boolean | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UserUpsertWithoutCampaignsInput = {
    update: XOR<UserUpdateWithoutCampaignsInput, UserUncheckedUpdateWithoutCampaignsInput>
    create: XOR<UserCreateWithoutCampaignsInput, UserUncheckedCreateWithoutCampaignsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutCampaignsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutCampaignsInput, UserUncheckedUpdateWithoutCampaignsInput>
  }

  export type UserUpdateWithoutCampaignsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    credits?: NullableIntFieldUpdateOperationsInput | number | null
    planTier?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resumes?: ResumeUpdateManyWithoutUserNestedInput
    jobApplications?: JobApplicationUpdateManyWithoutUserNestedInput
    transaction?: TransactionUpdateManyWithoutUserNestedInput
    stripeTransaction?: TransactionUpdateManyWithoutStripeCustomerNestedInput
  }

  export type UserUncheckedUpdateWithoutCampaignsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    credits?: NullableIntFieldUpdateOperationsInput | number | null
    planTier?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resumes?: ResumeUncheckedUpdateManyWithoutUserNestedInput
    jobApplications?: JobApplicationUncheckedUpdateManyWithoutUserNestedInput
    transaction?: TransactionUncheckedUpdateManyWithoutUserNestedInput
    stripeTransaction?: TransactionUncheckedUpdateManyWithoutStripeCustomerNestedInput
  }

  export type CampaignLinkedinUpsertWithoutCampaignInput = {
    update: XOR<CampaignLinkedinUpdateWithoutCampaignInput, CampaignLinkedinUncheckedUpdateWithoutCampaignInput>
    create: XOR<CampaignLinkedinCreateWithoutCampaignInput, CampaignLinkedinUncheckedCreateWithoutCampaignInput>
    where?: CampaignLinkedinWhereInput
  }

  export type CampaignLinkedinUpdateToOneWithWhereWithoutCampaignInput = {
    where?: CampaignLinkedinWhereInput
    data: XOR<CampaignLinkedinUpdateWithoutCampaignInput, CampaignLinkedinUncheckedUpdateWithoutCampaignInput>
  }

  export type CampaignLinkedinUpdateWithoutCampaignInput = {
    id?: StringFieldUpdateOperationsInput | string
    searchTerms?: NullableStringFieldUpdateOperationsInput | string | null
    locationTerm?: NullableStringFieldUpdateOperationsInput | string | null
    sortBy?: NullableEnumLinkedinSortFieldUpdateOperationsInput | $Enums.LinkedinSort | null
    datePosted?: NullableEnumLinkedinDateFieldUpdateOperationsInput | $Enums.LinkedinDate | null
    expLevel?: CampaignLinkedinUpdateexpLevelInput | $Enums.LinkedinExp[]
    jobType?: CampaignLinkedinUpdatejobTypeInput | $Enums.LinkedinJobType[]
    remoteFilter?: CampaignLinkedinUpdateremoteFilterInput | $Enums.LinkedinRemote[]
  }

  export type CampaignLinkedinUncheckedUpdateWithoutCampaignInput = {
    id?: StringFieldUpdateOperationsInput | string
    searchTerms?: NullableStringFieldUpdateOperationsInput | string | null
    locationTerm?: NullableStringFieldUpdateOperationsInput | string | null
    sortBy?: NullableEnumLinkedinSortFieldUpdateOperationsInput | $Enums.LinkedinSort | null
    datePosted?: NullableEnumLinkedinDateFieldUpdateOperationsInput | $Enums.LinkedinDate | null
    expLevel?: CampaignLinkedinUpdateexpLevelInput | $Enums.LinkedinExp[]
    jobType?: CampaignLinkedinUpdatejobTypeInput | $Enums.LinkedinJobType[]
    remoteFilter?: CampaignLinkedinUpdateremoteFilterInput | $Enums.LinkedinRemote[]
  }

  export type CampaignInfojobsUpsertWithoutCampaignInput = {
    update: XOR<CampaignInfojobsUpdateWithoutCampaignInput, CampaignInfojobsUncheckedUpdateWithoutCampaignInput>
    create: XOR<CampaignInfojobsCreateWithoutCampaignInput, CampaignInfojobsUncheckedCreateWithoutCampaignInput>
    where?: CampaignInfojobsWhereInput
  }

  export type CampaignInfojobsUpdateToOneWithWhereWithoutCampaignInput = {
    where?: CampaignInfojobsWhereInput
    data: XOR<CampaignInfojobsUpdateWithoutCampaignInput, CampaignInfojobsUncheckedUpdateWithoutCampaignInput>
  }

  export type CampaignInfojobsUpdateWithoutCampaignInput = {
    id?: StringFieldUpdateOperationsInput | string
    searchTerms?: NullableStringFieldUpdateOperationsInput | string | null
    locationState?: NullableEnumBrazilStateFieldUpdateOperationsInput | $Enums.BrazilState | null
    kmDeVoce?: NullableEnumIjRadiusFieldUpdateOperationsInput | $Enums.IjRadius | null
    salaryFilter?: NullableEnumIjSalaryFieldUpdateOperationsInput | $Enums.IjSalary | null
    datePosted?: NullableEnumIjDatePostedFieldUpdateOperationsInput | $Enums.IjDatePosted | null
    workModels?: CampaignInfojobsUpdateworkModelsInput | $Enums.IjWorkModel[]
    jobAreas?: CampaignInfojobsUpdatejobAreasInput | $Enums.IjJobArea[]
    contractTypes?: CampaignInfojobsUpdatecontractTypesInput | $Enums.IjContract[]
    workSchedules?: CampaignInfojobsUpdateworkSchedulesInput | $Enums.IjSchedule[]
    seniorityLevels?: CampaignInfojobsUpdateseniorityLevelsInput | $Enums.IjSeniority[]
    pcdTypes?: CampaignInfojobsUpdatepcdTypesInput | $Enums.IjPcd[]
  }

  export type CampaignInfojobsUncheckedUpdateWithoutCampaignInput = {
    id?: StringFieldUpdateOperationsInput | string
    searchTerms?: NullableStringFieldUpdateOperationsInput | string | null
    locationState?: NullableEnumBrazilStateFieldUpdateOperationsInput | $Enums.BrazilState | null
    kmDeVoce?: NullableEnumIjRadiusFieldUpdateOperationsInput | $Enums.IjRadius | null
    salaryFilter?: NullableEnumIjSalaryFieldUpdateOperationsInput | $Enums.IjSalary | null
    datePosted?: NullableEnumIjDatePostedFieldUpdateOperationsInput | $Enums.IjDatePosted | null
    workModels?: CampaignInfojobsUpdateworkModelsInput | $Enums.IjWorkModel[]
    jobAreas?: CampaignInfojobsUpdatejobAreasInput | $Enums.IjJobArea[]
    contractTypes?: CampaignInfojobsUpdatecontractTypesInput | $Enums.IjContract[]
    workSchedules?: CampaignInfojobsUpdateworkSchedulesInput | $Enums.IjSchedule[]
    seniorityLevels?: CampaignInfojobsUpdateseniorityLevelsInput | $Enums.IjSeniority[]
    pcdTypes?: CampaignInfojobsUpdatepcdTypesInput | $Enums.IjPcd[]
  }

  export type JobApplicationUpsertWithWhereUniqueWithoutCampaignInput = {
    where: JobApplicationWhereUniqueInput
    update: XOR<JobApplicationUpdateWithoutCampaignInput, JobApplicationUncheckedUpdateWithoutCampaignInput>
    create: XOR<JobApplicationCreateWithoutCampaignInput, JobApplicationUncheckedCreateWithoutCampaignInput>
  }

  export type JobApplicationUpdateWithWhereUniqueWithoutCampaignInput = {
    where: JobApplicationWhereUniqueInput
    data: XOR<JobApplicationUpdateWithoutCampaignInput, JobApplicationUncheckedUpdateWithoutCampaignInput>
  }

  export type JobApplicationUpdateManyWithWhereWithoutCampaignInput = {
    where: JobApplicationScalarWhereInput
    data: XOR<JobApplicationUpdateManyMutationInput, JobApplicationUncheckedUpdateManyWithoutCampaignInput>
  }

  export type CampaignCreateWithoutLinkedinConfigInput = {
    id?: string
    name?: string | null
    platform?: $Enums.Platform | null
    status?: string | null
    dailyLimit?: number | null
    createdAt?: Date | string | null
    resume?: ResumeCreateNestedOneWithoutCampaignsInput
    user?: UserCreateNestedOneWithoutCampaignsInput
    infojobsConfig?: CampaignInfojobsCreateNestedOneWithoutCampaignInput
    jobApplications?: JobApplicationCreateNestedManyWithoutCampaignInput
  }

  export type CampaignUncheckedCreateWithoutLinkedinConfigInput = {
    id?: string
    resumeId?: string | null
    userId?: string | null
    name?: string | null
    platform?: $Enums.Platform | null
    status?: string | null
    dailyLimit?: number | null
    createdAt?: Date | string | null
    infojobsConfig?: CampaignInfojobsUncheckedCreateNestedOneWithoutCampaignInput
    jobApplications?: JobApplicationUncheckedCreateNestedManyWithoutCampaignInput
  }

  export type CampaignCreateOrConnectWithoutLinkedinConfigInput = {
    where: CampaignWhereUniqueInput
    create: XOR<CampaignCreateWithoutLinkedinConfigInput, CampaignUncheckedCreateWithoutLinkedinConfigInput>
  }

  export type CampaignUpsertWithoutLinkedinConfigInput = {
    update: XOR<CampaignUpdateWithoutLinkedinConfigInput, CampaignUncheckedUpdateWithoutLinkedinConfigInput>
    create: XOR<CampaignCreateWithoutLinkedinConfigInput, CampaignUncheckedCreateWithoutLinkedinConfigInput>
    where?: CampaignWhereInput
  }

  export type CampaignUpdateToOneWithWhereWithoutLinkedinConfigInput = {
    where?: CampaignWhereInput
    data: XOR<CampaignUpdateWithoutLinkedinConfigInput, CampaignUncheckedUpdateWithoutLinkedinConfigInput>
  }

  export type CampaignUpdateWithoutLinkedinConfigInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    platform?: NullableEnumPlatformFieldUpdateOperationsInput | $Enums.Platform | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    dailyLimit?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resume?: ResumeUpdateOneWithoutCampaignsNestedInput
    user?: UserUpdateOneWithoutCampaignsNestedInput
    infojobsConfig?: CampaignInfojobsUpdateOneWithoutCampaignNestedInput
    jobApplications?: JobApplicationUpdateManyWithoutCampaignNestedInput
  }

  export type CampaignUncheckedUpdateWithoutLinkedinConfigInput = {
    id?: StringFieldUpdateOperationsInput | string
    resumeId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    platform?: NullableEnumPlatformFieldUpdateOperationsInput | $Enums.Platform | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    dailyLimit?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    infojobsConfig?: CampaignInfojobsUncheckedUpdateOneWithoutCampaignNestedInput
    jobApplications?: JobApplicationUncheckedUpdateManyWithoutCampaignNestedInput
  }

  export type CampaignCreateWithoutInfojobsConfigInput = {
    id?: string
    name?: string | null
    platform?: $Enums.Platform | null
    status?: string | null
    dailyLimit?: number | null
    createdAt?: Date | string | null
    resume?: ResumeCreateNestedOneWithoutCampaignsInput
    user?: UserCreateNestedOneWithoutCampaignsInput
    linkedinConfig?: CampaignLinkedinCreateNestedOneWithoutCampaignInput
    jobApplications?: JobApplicationCreateNestedManyWithoutCampaignInput
  }

  export type CampaignUncheckedCreateWithoutInfojobsConfigInput = {
    id?: string
    resumeId?: string | null
    userId?: string | null
    name?: string | null
    platform?: $Enums.Platform | null
    status?: string | null
    dailyLimit?: number | null
    createdAt?: Date | string | null
    linkedinConfig?: CampaignLinkedinUncheckedCreateNestedOneWithoutCampaignInput
    jobApplications?: JobApplicationUncheckedCreateNestedManyWithoutCampaignInput
  }

  export type CampaignCreateOrConnectWithoutInfojobsConfigInput = {
    where: CampaignWhereUniqueInput
    create: XOR<CampaignCreateWithoutInfojobsConfigInput, CampaignUncheckedCreateWithoutInfojobsConfigInput>
  }

  export type CampaignUpsertWithoutInfojobsConfigInput = {
    update: XOR<CampaignUpdateWithoutInfojobsConfigInput, CampaignUncheckedUpdateWithoutInfojobsConfigInput>
    create: XOR<CampaignCreateWithoutInfojobsConfigInput, CampaignUncheckedCreateWithoutInfojobsConfigInput>
    where?: CampaignWhereInput
  }

  export type CampaignUpdateToOneWithWhereWithoutInfojobsConfigInput = {
    where?: CampaignWhereInput
    data: XOR<CampaignUpdateWithoutInfojobsConfigInput, CampaignUncheckedUpdateWithoutInfojobsConfigInput>
  }

  export type CampaignUpdateWithoutInfojobsConfigInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    platform?: NullableEnumPlatformFieldUpdateOperationsInput | $Enums.Platform | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    dailyLimit?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resume?: ResumeUpdateOneWithoutCampaignsNestedInput
    user?: UserUpdateOneWithoutCampaignsNestedInput
    linkedinConfig?: CampaignLinkedinUpdateOneWithoutCampaignNestedInput
    jobApplications?: JobApplicationUpdateManyWithoutCampaignNestedInput
  }

  export type CampaignUncheckedUpdateWithoutInfojobsConfigInput = {
    id?: StringFieldUpdateOperationsInput | string
    resumeId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    platform?: NullableEnumPlatformFieldUpdateOperationsInput | $Enums.Platform | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    dailyLimit?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    linkedinConfig?: CampaignLinkedinUncheckedUpdateOneWithoutCampaignNestedInput
    jobApplications?: JobApplicationUncheckedUpdateManyWithoutCampaignNestedInput
  }

  export type CampaignCreateWithoutJobApplicationsInput = {
    id?: string
    name?: string | null
    platform?: $Enums.Platform | null
    status?: string | null
    dailyLimit?: number | null
    createdAt?: Date | string | null
    resume?: ResumeCreateNestedOneWithoutCampaignsInput
    user?: UserCreateNestedOneWithoutCampaignsInput
    linkedinConfig?: CampaignLinkedinCreateNestedOneWithoutCampaignInput
    infojobsConfig?: CampaignInfojobsCreateNestedOneWithoutCampaignInput
  }

  export type CampaignUncheckedCreateWithoutJobApplicationsInput = {
    id?: string
    resumeId?: string | null
    userId?: string | null
    name?: string | null
    platform?: $Enums.Platform | null
    status?: string | null
    dailyLimit?: number | null
    createdAt?: Date | string | null
    linkedinConfig?: CampaignLinkedinUncheckedCreateNestedOneWithoutCampaignInput
    infojobsConfig?: CampaignInfojobsUncheckedCreateNestedOneWithoutCampaignInput
  }

  export type CampaignCreateOrConnectWithoutJobApplicationsInput = {
    where: CampaignWhereUniqueInput
    create: XOR<CampaignCreateWithoutJobApplicationsInput, CampaignUncheckedCreateWithoutJobApplicationsInput>
  }

  export type UserCreateWithoutJobApplicationsInput = {
    id: string
    email: string
    password?: string | null
    role?: $Enums.UserRole
    stripeCustomerId?: string | null
    credits?: number | null
    planTier?: string | null
    createdAt?: Date | string | null
    resumes?: ResumeCreateNestedManyWithoutUserInput
    campaigns?: CampaignCreateNestedManyWithoutUserInput
    transaction?: TransactionCreateNestedManyWithoutUserInput
    stripeTransaction?: TransactionCreateNestedManyWithoutStripeCustomerInput
  }

  export type UserUncheckedCreateWithoutJobApplicationsInput = {
    id: string
    email: string
    password?: string | null
    role?: $Enums.UserRole
    stripeCustomerId?: string | null
    credits?: number | null
    planTier?: string | null
    createdAt?: Date | string | null
    resumes?: ResumeUncheckedCreateNestedManyWithoutUserInput
    campaigns?: CampaignUncheckedCreateNestedManyWithoutUserInput
    transaction?: TransactionUncheckedCreateNestedManyWithoutUserInput
    stripeTransaction?: TransactionUncheckedCreateNestedManyWithoutStripeCustomerInput
  }

  export type UserCreateOrConnectWithoutJobApplicationsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutJobApplicationsInput, UserUncheckedCreateWithoutJobApplicationsInput>
  }

  export type CampaignUpsertWithoutJobApplicationsInput = {
    update: XOR<CampaignUpdateWithoutJobApplicationsInput, CampaignUncheckedUpdateWithoutJobApplicationsInput>
    create: XOR<CampaignCreateWithoutJobApplicationsInput, CampaignUncheckedCreateWithoutJobApplicationsInput>
    where?: CampaignWhereInput
  }

  export type CampaignUpdateToOneWithWhereWithoutJobApplicationsInput = {
    where?: CampaignWhereInput
    data: XOR<CampaignUpdateWithoutJobApplicationsInput, CampaignUncheckedUpdateWithoutJobApplicationsInput>
  }

  export type CampaignUpdateWithoutJobApplicationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    platform?: NullableEnumPlatformFieldUpdateOperationsInput | $Enums.Platform | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    dailyLimit?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resume?: ResumeUpdateOneWithoutCampaignsNestedInput
    user?: UserUpdateOneWithoutCampaignsNestedInput
    linkedinConfig?: CampaignLinkedinUpdateOneWithoutCampaignNestedInput
    infojobsConfig?: CampaignInfojobsUpdateOneWithoutCampaignNestedInput
  }

  export type CampaignUncheckedUpdateWithoutJobApplicationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    resumeId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    platform?: NullableEnumPlatformFieldUpdateOperationsInput | $Enums.Platform | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    dailyLimit?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    linkedinConfig?: CampaignLinkedinUncheckedUpdateOneWithoutCampaignNestedInput
    infojobsConfig?: CampaignInfojobsUncheckedUpdateOneWithoutCampaignNestedInput
  }

  export type UserUpsertWithoutJobApplicationsInput = {
    update: XOR<UserUpdateWithoutJobApplicationsInput, UserUncheckedUpdateWithoutJobApplicationsInput>
    create: XOR<UserCreateWithoutJobApplicationsInput, UserUncheckedCreateWithoutJobApplicationsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutJobApplicationsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutJobApplicationsInput, UserUncheckedUpdateWithoutJobApplicationsInput>
  }

  export type UserUpdateWithoutJobApplicationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    credits?: NullableIntFieldUpdateOperationsInput | number | null
    planTier?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resumes?: ResumeUpdateManyWithoutUserNestedInput
    campaigns?: CampaignUpdateManyWithoutUserNestedInput
    transaction?: TransactionUpdateManyWithoutUserNestedInput
    stripeTransaction?: TransactionUpdateManyWithoutStripeCustomerNestedInput
  }

  export type UserUncheckedUpdateWithoutJobApplicationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    credits?: NullableIntFieldUpdateOperationsInput | number | null
    planTier?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resumes?: ResumeUncheckedUpdateManyWithoutUserNestedInput
    campaigns?: CampaignUncheckedUpdateManyWithoutUserNestedInput
    transaction?: TransactionUncheckedUpdateManyWithoutUserNestedInput
    stripeTransaction?: TransactionUncheckedUpdateManyWithoutStripeCustomerNestedInput
  }

  export type ResumeCreateManyUserInput = {
    id?: string
    title?: string | null
    personalInfo?: NullableJsonNullValueInput | InputJsonValue
    education?: NullableJsonNullValueInput | InputJsonValue
    experience?: NullableJsonNullValueInput | InputJsonValue
    skills?: NullableJsonNullValueInput | InputJsonValue
    isDefault?: boolean | null
    createdAt?: Date | string | null
  }

  export type CampaignCreateManyUserInput = {
    id?: string
    resumeId?: string | null
    name?: string | null
    platform?: $Enums.Platform | null
    status?: string | null
    dailyLimit?: number | null
    createdAt?: Date | string | null
  }

  export type JobApplicationCreateManyUserInput = {
    id?: string
    campaignId?: string | null
    platform?: $Enums.Platform | null
    companyName?: string | null
    jobTitle?: string | null
    jobUrl?: string | null
    status?: $Enums.AppStatus | null
    errorLog?: string | null
    appliedAt?: Date | string | null
    createdAt?: Date | string | null
  }

  export type TransactionCreateManyUserInput = {
    id?: string
    amount?: number | null
    type?: $Enums.TransactionType | null
    reference_id?: string | null
    description?: string | null
    created_at?: Date | string | null
  }

  export type TransactionCreateManyStripeCustomerInput = {
    id?: string
    userId?: string | null
    amount?: number | null
    type?: $Enums.TransactionType | null
    description?: string | null
    created_at?: Date | string | null
  }

  export type ResumeUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    personalInfo?: NullableJsonNullValueInput | InputJsonValue
    education?: NullableJsonNullValueInput | InputJsonValue
    experience?: NullableJsonNullValueInput | InputJsonValue
    skills?: NullableJsonNullValueInput | InputJsonValue
    isDefault?: NullableBoolFieldUpdateOperationsInput | boolean | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    campaigns?: CampaignUpdateManyWithoutResumeNestedInput
  }

  export type ResumeUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    personalInfo?: NullableJsonNullValueInput | InputJsonValue
    education?: NullableJsonNullValueInput | InputJsonValue
    experience?: NullableJsonNullValueInput | InputJsonValue
    skills?: NullableJsonNullValueInput | InputJsonValue
    isDefault?: NullableBoolFieldUpdateOperationsInput | boolean | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    campaigns?: CampaignUncheckedUpdateManyWithoutResumeNestedInput
  }

  export type ResumeUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    personalInfo?: NullableJsonNullValueInput | InputJsonValue
    education?: NullableJsonNullValueInput | InputJsonValue
    experience?: NullableJsonNullValueInput | InputJsonValue
    skills?: NullableJsonNullValueInput | InputJsonValue
    isDefault?: NullableBoolFieldUpdateOperationsInput | boolean | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type CampaignUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    platform?: NullableEnumPlatformFieldUpdateOperationsInput | $Enums.Platform | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    dailyLimit?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resume?: ResumeUpdateOneWithoutCampaignsNestedInput
    linkedinConfig?: CampaignLinkedinUpdateOneWithoutCampaignNestedInput
    infojobsConfig?: CampaignInfojobsUpdateOneWithoutCampaignNestedInput
    jobApplications?: JobApplicationUpdateManyWithoutCampaignNestedInput
  }

  export type CampaignUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    resumeId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    platform?: NullableEnumPlatformFieldUpdateOperationsInput | $Enums.Platform | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    dailyLimit?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    linkedinConfig?: CampaignLinkedinUncheckedUpdateOneWithoutCampaignNestedInput
    infojobsConfig?: CampaignInfojobsUncheckedUpdateOneWithoutCampaignNestedInput
    jobApplications?: JobApplicationUncheckedUpdateManyWithoutCampaignNestedInput
  }

  export type CampaignUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    resumeId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    platform?: NullableEnumPlatformFieldUpdateOperationsInput | $Enums.Platform | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    dailyLimit?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type JobApplicationUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    platform?: NullableEnumPlatformFieldUpdateOperationsInput | $Enums.Platform | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    jobTitle?: NullableStringFieldUpdateOperationsInput | string | null
    jobUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableEnumAppStatusFieldUpdateOperationsInput | $Enums.AppStatus | null
    errorLog?: NullableStringFieldUpdateOperationsInput | string | null
    appliedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    campaign?: CampaignUpdateOneWithoutJobApplicationsNestedInput
  }

  export type JobApplicationUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    campaignId?: NullableStringFieldUpdateOperationsInput | string | null
    platform?: NullableEnumPlatformFieldUpdateOperationsInput | $Enums.Platform | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    jobTitle?: NullableStringFieldUpdateOperationsInput | string | null
    jobUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableEnumAppStatusFieldUpdateOperationsInput | $Enums.AppStatus | null
    errorLog?: NullableStringFieldUpdateOperationsInput | string | null
    appliedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type JobApplicationUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    campaignId?: NullableStringFieldUpdateOperationsInput | string | null
    platform?: NullableEnumPlatformFieldUpdateOperationsInput | $Enums.Platform | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    jobTitle?: NullableStringFieldUpdateOperationsInput | string | null
    jobUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableEnumAppStatusFieldUpdateOperationsInput | $Enums.AppStatus | null
    errorLog?: NullableStringFieldUpdateOperationsInput | string | null
    appliedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TransactionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: NullableIntFieldUpdateOperationsInput | number | null
    type?: NullableEnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    stripeCustomer?: UserUpdateOneWithoutStripeTransactionNestedInput
  }

  export type TransactionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: NullableIntFieldUpdateOperationsInput | number | null
    type?: NullableEnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType | null
    reference_id?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TransactionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: NullableIntFieldUpdateOperationsInput | number | null
    type?: NullableEnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType | null
    reference_id?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TransactionUpdateWithoutStripeCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: NullableIntFieldUpdateOperationsInput | number | null
    type?: NullableEnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneWithoutTransactionNestedInput
  }

  export type TransactionUncheckedUpdateWithoutStripeCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: NullableIntFieldUpdateOperationsInput | number | null
    type?: NullableEnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TransactionUncheckedUpdateManyWithoutStripeCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: NullableIntFieldUpdateOperationsInput | number | null
    type?: NullableEnumTransactionTypeFieldUpdateOperationsInput | $Enums.TransactionType | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type CampaignCreateManyResumeInput = {
    id?: string
    userId?: string | null
    name?: string | null
    platform?: $Enums.Platform | null
    status?: string | null
    dailyLimit?: number | null
    createdAt?: Date | string | null
  }

  export type CampaignUpdateWithoutResumeInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    platform?: NullableEnumPlatformFieldUpdateOperationsInput | $Enums.Platform | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    dailyLimit?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneWithoutCampaignsNestedInput
    linkedinConfig?: CampaignLinkedinUpdateOneWithoutCampaignNestedInput
    infojobsConfig?: CampaignInfojobsUpdateOneWithoutCampaignNestedInput
    jobApplications?: JobApplicationUpdateManyWithoutCampaignNestedInput
  }

  export type CampaignUncheckedUpdateWithoutResumeInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    platform?: NullableEnumPlatformFieldUpdateOperationsInput | $Enums.Platform | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    dailyLimit?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    linkedinConfig?: CampaignLinkedinUncheckedUpdateOneWithoutCampaignNestedInput
    infojobsConfig?: CampaignInfojobsUncheckedUpdateOneWithoutCampaignNestedInput
    jobApplications?: JobApplicationUncheckedUpdateManyWithoutCampaignNestedInput
  }

  export type CampaignUncheckedUpdateManyWithoutResumeInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    platform?: NullableEnumPlatformFieldUpdateOperationsInput | $Enums.Platform | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    dailyLimit?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type JobApplicationCreateManyCampaignInput = {
    id?: string
    userId?: string | null
    platform?: $Enums.Platform | null
    companyName?: string | null
    jobTitle?: string | null
    jobUrl?: string | null
    status?: $Enums.AppStatus | null
    errorLog?: string | null
    appliedAt?: Date | string | null
    createdAt?: Date | string | null
  }

  export type JobApplicationUpdateWithoutCampaignInput = {
    id?: StringFieldUpdateOperationsInput | string
    platform?: NullableEnumPlatformFieldUpdateOperationsInput | $Enums.Platform | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    jobTitle?: NullableStringFieldUpdateOperationsInput | string | null
    jobUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableEnumAppStatusFieldUpdateOperationsInput | $Enums.AppStatus | null
    errorLog?: NullableStringFieldUpdateOperationsInput | string | null
    appliedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneWithoutJobApplicationsNestedInput
  }

  export type JobApplicationUncheckedUpdateWithoutCampaignInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    platform?: NullableEnumPlatformFieldUpdateOperationsInput | $Enums.Platform | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    jobTitle?: NullableStringFieldUpdateOperationsInput | string | null
    jobUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableEnumAppStatusFieldUpdateOperationsInput | $Enums.AppStatus | null
    errorLog?: NullableStringFieldUpdateOperationsInput | string | null
    appliedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type JobApplicationUncheckedUpdateManyWithoutCampaignInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    platform?: NullableEnumPlatformFieldUpdateOperationsInput | $Enums.Platform | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    jobTitle?: NullableStringFieldUpdateOperationsInput | string | null
    jobUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableEnumAppStatusFieldUpdateOperationsInput | $Enums.AppStatus | null
    errorLog?: NullableStringFieldUpdateOperationsInput | string | null
    appliedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}