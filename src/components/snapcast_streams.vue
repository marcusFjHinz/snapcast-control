<template>
  <div>
    <div v-for="stream in get_streams()" :key="stream.id">
      <stream_list_item_active v-if="get_is_active(stream)" :stream="stream"/>
    </div>
    <div v-for="stream in get_streams()" :key="stream.id">
      <stream_list_item_idle v-if="!get_is_active(stream)" :stream="stream"/>
    </div>
    <div>
      <stream_list_item_new/>
    </div>
  </div>
</template>
<script lang="ts">
import {defineComponent, inject} from "vue";
import stream_list_item_active from './stream_list_item_active.vue';
import stream_list_item_idle from './stream_list_item_idle.vue';
import stream_list_item_new from './stream_list_item_new.vue';

import {Stream} from "@/model/Stream";

import {snapcast_service} from "@/services/snapcast_service";


export default defineComponent({
  name: 'snapcast_streams',
  components: {
    stream_list_item_active,
    stream_list_item_idle,
    stream_list_item_new,
  },
  setup() {
    const snapcastService = (inject('snapcast_service') as snapcast_service);
    const players = snapcastService.players.value;

    const get_streams = (): Stream[] => {
      return (snapcastService.streams.value as Stream[]);
    }
    const get_is_active = (stream: Stream): boolean => {
      return players.filter((p) => p.stream_id === stream.id).length > 0;
    }

    return {
      get_is_active,
      get_streams,
    }
  }
});


</script>

<style scoped lang="css">

</style>