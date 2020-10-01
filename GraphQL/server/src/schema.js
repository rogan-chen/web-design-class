/**
 * @Author: Rogan
 * @Date: 2020-10-01
 * @Description: 定义模板
 */

const graphql = require('graphql');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLNonNull,
    GraphQLList,
} = graphql;

// 定义分类数据
const categories = [
    { id: '1', name: '图书' },
    { id: '2', name: '数码' },
    { id: '3', name: '食品' },
];

// 定义产品数据
const products = [
    { id: '1', name: '红楼梦', category: '1' },
    { id: '2', name: '西游记', category: '1' },
    { id: '3', name: '三国演技', category: '1' },
    { id: '4', name: '水浒传', category: '1' },
    { id: '5', name: 'iPhone', category: '2' },
    { id: '6', name: '华为', category: '2' },
    { id: '7', name: '三星', category: '2' },
    { id: '8', name: '面包', category: '3' },
    { id: '9', name: '月饼', category: '3' },
];

// 定义分类类型
const CategoryType = new GraphQLObjectType({
    name: 'CategoryType', // 类型名称
    fields: () => ({ // 类型字段
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        products: {
            // 产品类型列表
            type: new GraphQLList(ProductType),
            resolve: parent => {
                // 筛选出符合分类ID的产品
                return products.filter(item => item.category === parent.id)
            }
        }
    })
});

// 定义产品类型
const ProductType = new GraphQLObjectType({
    name: 'ProductType', // 类型名称
    fields: () => ({ // 类型字段
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        // category: { type: GraphQLString },
        category: {
            // 将字符串类型转换成CategoryType类型
            type: CategoryType,
            resolve: parent => {
                // 筛选出符合产品ID的分类
                // parent.category是一个字符串
                return categories.find(item => item.id === parent.category)
            }
        },
    })
});

// 根查询类型 query
const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: () => ({
        /**
         * 根据分类ID查询分类
         * getCategory(id: "1") { id, name }
         * 需要传参时，需要用括号将参数包起来
         */
        getCategory: {
            // 返回的类型
            type: CategoryType,

            // 传递过来的参数
            args: {
                // id必须是非空字符串
                id: { type: GraphQLNonNull(GraphQLString) }
            },

            // 解析处理请求
            // args就是上方传递过来的参数
            resolve: (parent, args) => {
                return categories.find(item => item.id === args.id);
            },
        },

        /**
         * 查询所有分类
         * getCategories { id, name }
         * 不需要传参时，不需要用到括号
         */
        getCategories: {
            // 返回的类型
            type: GraphQLList(CategoryType),

            // 传递过来的参数
            args: {},

            // 解析处理请请求
            resolve: () => {
                return categories;
            }
        },

        // 根据产品ID查询单个产品数据
        getProduct: {
            // 返回的类型
            type: ProductType,

            // 传递过来的参数
            args: {
                id: { type: GraphQLNonNull(GraphQLString) }
            },

            // 解析处理请求
            resolve: (parent, args) => {
                return products.find(item => item.id === args.id);
            },
        },

        // 获取所有产品的数据
        getProducts: {
            // 返回的数据
            type: GraphQLList(ProductType),

            // 传递过来的参数
            args: {},

            // 解析处理请求
            resolve: () => products,
        },
    })
});

// 根修改类型 mutation
const RootMutation = new GraphQLObjectType({
    name: 'RootMutation',
    fields: () => ({
        // 添加分类数据
        addCategory: {
            // 返回的数据类型
            type: CategoryType,

            // 传递过来的参数
            args: {
                // 分类名称
                name: {
                    type: GraphQLString
                },
            },

            // 解析处理请求
            resolve: (parent, args) => {
                args.id = categories.length + 1;
                categories.push(args);
                return args;
            }
        },

        // 添加产品数据
        addProduct: {
            // 返回的数据类型
            type: ProductType,

            // 传递过来的参数
            args: {
                // 产品名称
                name: {
                    type: new GraphQLNonNull(GraphQLString),
                },

                // 分类ID
                category: {
                    type: new GraphQLNonNull(GraphQLString),
                },
            },

            // 解析处理请求
            resolve: (parent, args) => {
                args.id = products.length + 1;
                products.push(args);
                return args;
            }
        },
    })
})

// 定义shema
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation,
});