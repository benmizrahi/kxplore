import { KxploreResultsBuilder } from "./kxplore-results-builder";


it("testing-results-builder",()=>{
   let builder = new KxploreResultsBuilder();
   let b:any = {connectionObject:{query:"select player_id,count(1) from kafka_int.monsterball group by 1"}}
   builder.build(b,[])
})