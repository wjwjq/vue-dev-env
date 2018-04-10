<template>
    <div class="panel" >
        <h3>{{ sourceName }}Top{{ topNum }}</h3>
        <ul>
            <li 
                v-for="item in data"
                :key="item.name" 
                :class="{'panel-item': true, active: activeItem === item.name}"
                @click="handleItemClick(item)" >
                <span>{{ item.name }}</span>
                <i>{{ item.pre }}</i>
            </li>
        </ul>
    </div>  
</template>

<script>
export default {
  name: "Panel",

  props: {
    dataSource: {
      default: () => [],
      type: Array
    },
    
    column: {
      default: () => [ { title: "", key: "" } ],
      type: Array 
    }
  }
};
</script>


