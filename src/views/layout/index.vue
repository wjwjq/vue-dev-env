<template>
    <div>
        这是{{page}}页面
    </div>
</template>
<script>
// <keep-alive>
//         <router-view></router-view>
//     </keep-alive>
export default {
    data: function () {
        return {
            page: 'index'
        }
    }
}
</script>