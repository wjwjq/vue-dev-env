<template>
    <div style="padding: 30px;">
        <h1>{{ message }}</h1>

        <br>
        <div style="border: 1px solid #eee; padding: 15px;">
            <h3>vue router 应用</h3>
            <br>
            <ul>
                <li
                    style="font-size: 16px; line-height: 2; display: inline-block; width: 60px; text-aligin: center;"
                    v-for="(tab, idx) in tabs"
                    :key="idx">
                    <router-link :to="`/${tab}`">{{ tab }}</router-link>
                </li>
            </ul>
        </div>
    
        <br>
    
        <div style="border: 1px solid #eee; padding: 15px;">
            <h3>简单 vuex 应用</h3>
            <br>
            <counter />
        </div>
    
        <br>

        <div style="border: 1px solid #eee; padding: 15px;">
            <h3>element UI 应用</h3>
            <el-tabs v-model="activeName">
                <el-tab-pane 
                    v-for="(tab,idx) in tabs"
                    :key="idx"
                    :label="tab" 
                    :name="tab">
                    {{ tab }}
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<script>
import counter from "components/counter";
export default {
  components: {
    counter
  },
  data() {
    return {
      message: "首页",
      activeName: "tab1",
      tabs: ["tab1", "tab2"]
    };
  }
};
</script>