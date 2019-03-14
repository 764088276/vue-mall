const components={
  mounted(){
    this._initComponents()
  },
  methods:{
    _initComponents(){
      this.loading=this.$refs.loading||'';
      this.toast=this.$refs.toast||'';
      this.confirm=this.$refs.confirm||'';
    }
  }
};
export default components;
