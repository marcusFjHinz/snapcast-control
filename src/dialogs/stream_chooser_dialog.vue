<template>
  <q-dialog>
    <q-card>
      <q-card-section>
        <div v-for="stream in get_streams()" :key="stream.id">
          <q-btn :label=stream.name color="primary" v-close-popup @click="move_to_stream(stream)" flat
                 class="full-width"></q-btn>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">

import {defineComponent, inject} from "vue";
import {Stream} from "@/model/Stream";
import {snapcast_service} from "@/services/snapcast_service";
import {Player} from "@/model/Player";

export default defineComponent({


  name: 'stream_chooser_dialog',
  props: {
    chosen_stream:{
      type: Stream,
    },
    chosen_player:{
      type: Player,
    },
  },
  setup(props){

    const snapcastService = (inject('snapcast_service') as snapcast_service);

    const get_streams = (): Stream[] => {
      const stream_array = (snapcastService.streams.value as Stream[]);
      if(props.chosen_player === undefined && props.chosen_stream === undefined) return stream_array;
      if(props.chosen_stream !== undefined){
        return stream_array.filter((st) => props.chosen_stream !== undefined && st.id != props.chosen_stream.id);
      }
      if(props.chosen_player !== undefined && props.chosen_player.is_idle) return stream_array;
      return stream_array.filter((st) => props.chosen_player !== undefined && st.id != props.chosen_player.stream_id);
    }

    const move_to_stream = (stream: Stream): void => {
      if(props.chosen_stream !== undefined ) snapcastService.replace_stream(props.chosen_stream, stream);
      if(props.chosen_player !== undefined ) snapcastService.set_stream_for_player(stream, props.chosen_player);
    }

    return{
      move_to_stream,
      get_streams
    }

  }
});
</script>