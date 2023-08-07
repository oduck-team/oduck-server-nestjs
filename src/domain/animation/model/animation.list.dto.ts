export namespace IAnimation {
    export interface IList {
        /**
         * @default 1
         * */
        page?: number

        /**
         * @default 20
         * */
        length?: number

        /**
         * @default 바키
         * */
        search?: string

        /**
         * @default createdAt
         * */
        sortKey?: string

        /**
         * @default desc
         * */
        sort?: string
    }
}
