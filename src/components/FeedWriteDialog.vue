<template>
  <v-dialog
            transition="dialog-bottom-transition"
            max-width="600"
            v-model="dialog"
        >
            <template v-slot:default="dialog">
            <v-card>
                <v-toolbar color="primary" dark>功能介紹</v-toolbar>

                <v-card-text class="my-4">
                    <!-- 電腦版 -->
                    <v-stepper v-if="step_show_big"  v-model="e6">
                        <v-stepper-header>
                            <!-- Step 01 -->
                            <v-stepper-step :complete="e6 >1" step="1" @click="e6 = 1">
                                選擇資料夾
                            </v-stepper-step>
                            <v-divider></v-divider>

                            <!-- Step 02 -->
                            <v-stepper-step :complete="e6 > 2" step="2" @click="e6 = 2">
                                點擊檔案下載
                            </v-stepper-step>
                            <v-divider></v-divider>

                            <!-- Step 03 -->
                            <v-stepper-step :complete="e6 > 3" step="3" @click="e6 = 3">
                                下載完成
                            </v-stepper-step>
                            <v-divider></v-divider>
                        </v-stepper-header>

                        <v-stepper-items>
                            <!-- Step 01 -->
                            <v-stepper-content step="1">
                                <v-card  class="mb-12 pa-8" height="300px">
                                    <label for="question_one" class="teal--text text-darken-3 font-weight-bold">蝦子長度</label>
                                    <v-text-field label="填入蝦子長度"  solo prepend-inner-icon="mdi-crowd"></v-text-field>

                                    <div class="text-center button_margin_top">
                                        <v-btn color="success" @click="e6 = 2" >確認</v-btn>
                                    </div>
                                </v-card>
                            </v-stepper-content>

                            <!-- Step 02 -->
                            <v-stepper-content step="2">
                                <v-card color="grey lighten-1" class="mb-12" height="300px">
                                </v-card>
                            </v-stepper-content>

                            <!-- Step 03 -->
                            <v-stepper-content step="3">
                                <v-card color="grey lighten-1" class="mb-12" height="300px">
                                </v-card>
                            </v-stepper-content>

                        </v-stepper-items>
                    </v-stepper>

                    <!-- 手機板 -->
                    <v-stepper v-else v-model="e6" vertical>
                        <!-- Step 01 -->
                        <v-stepper-step :complete="e6 > 1" step="1" @click="e6 = 1">
                            選擇資料夾
                        </v-stepper-step>
                        <v-stepper-content step="1">
                            <v-card color="grey lighten-1" class="mb-12" height="200px">
                                <label for="question_one" class="teal--text text-darken-3 font-weight-bold">蝦子長度</label>
                                <v-text-field label="填入蝦子長度"  solo prepend-inner-icon="mdi-crowd"></v-text-field>
                            </v-card>
                        </v-stepper-content>

                        <!-- Step 02 -->
                        <v-stepper-step :complete="e6 >2" step="2" @click="e6 = 2">
                            點擊檔案下載
                        </v-stepper-step>
                        <v-stepper-content step="2">
                            <v-card color="grey lighten-1" class="mb-12" height="200px">
                            </v-card>
                        </v-stepper-content>

                        <!-- Step 03 -->
                        <v-stepper-step :complete="e6 > 3" step="3" @click="e6 = 3">
                            下載完成
                        </v-stepper-step>
                        <v-stepper-content step="3">
                            <v-card color="grey lighten-1" class="mb-12" height="200px">
                            </v-card>
                        </v-stepper-content>
                    </v-stepper>
                </v-card-text>

                <v-card-actions class="justify-end">
                    <v-btn text @click="$emit('close')" color="primary" class="font-weight-bold">關閉</v-btn>
                </v-card-actions>
            </v-card>
            </template>
        </v-dialog>
</template>

<script>
export default {
    props:{
        dialog:{
            type: Boolean,
            default: false,
        }
    },
    data(){
        return{
            // 所有已被儲存的資料夾
            e6: 1,
        }
    },
    computed:{
      step_show_big(){
          switch (this.$vuetify.breakpoint.name) {
            case 'xs': return false;
            case 'sm': return false;
            case 'md': return true;
            case 'lg': return true;
            case 'xl': return true;
        }
        return true;
      }
    },


}
</script>

<style lang="scss" scoped>
    .button_margin_top{
        margin-top: auto !important;
    }
</style>>

