const DAYS=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const SUPABASE_URL='https://tvwaldmnlcucqlmaqteu.supabase.co';
const SUPABASE_PUBLISHABLE_KEY='sb_publishable__seNOWj61jtMOze5TMCRfA_vISD16Bk';
const supabaseClient=window.supabase.createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY);
let currentUser=null,currentHousehold=null,realtimeChannel=null,plannerSaveTimer=null,applyingRemoteState=false;

const meals=[
  {id:'overnight-oats',name:'Protein overnight oats',type:'breakfast',protein:32,tags:['quick','kid'],desc:'Oats, Fairlife milk, Greek yogurt, berries; optional scoop of protein.',ingredients:[['rolled oats','Costco'],['Fairlife milk','Fred Meyer'],['Greek yogurt','Costco'],['berries','Costco']]},
  {id:'egg-box',name:'Grab-and-go egg box',type:'breakfast',protein:28,tags:['quick','kid'],desc:'2 hard-boiled eggs, Greek yogurt cup, fruit.',ingredients:[['eggs','Costco'],['Greek yogurt','Costco'],['fruit','Costco']]},
  {id:'protein-muffins',name:'Protein muffins + yogurt',type:'breakfast',protein:30,tags:['quick','kid'],desc:'Batch-baked muffins with a Greek yogurt side.',ingredients:[['protein muffin ingredients','Fred Meyer'],['Greek yogurt','Costco']]},
  {id:'pancakes',name:'Weekend pancakes + eggs',type:'breakfast',protein:26,tags:['kid'],desc:'Family pancakes with eggs and milk on the side.',ingredients:[['pancake mix','Costco'],['eggs','Costco'],['milk','Fred Meyer']]},
  {id:'yogurt-bowl',name:'Greek yogurt crunch bowl',type:'breakfast',protein:29,tags:['quick'],desc:'Greek yogurt, berries, granola, chia; optional peanut butter.',ingredients:[['Greek yogurt','Costco'],['berries','Costco'],['granola','Trader Joe\'s'],['chia seeds','Costco']]},

  {id:'leftovers',name:'Dinner leftovers',type:'lunch',protein:35,tags:['quick','leftover'],desc:'Automatically use the previous dinner when possible.',ingredients:[]},
  {id:'greek-cold-salad',name:'Greek quinoa cold salad',type:'lunch',protein:30,tags:['quick','new'],desc:'Quinoa, kale, tomatoes, olives, feta, chickpeas, chicken optional.',ingredients:[['quinoa','Costco'],['kale','Fred Meyer'],['tomatoes','Costco'],['olives','Trader Joe\'s'],['feta','Costco'],['chickpeas','Costco']]},
  {id:'turkey-wrap',name:'Turkey wrap + fruit',type:'lunch',protein:38,tags:['quick','kid'],desc:'Turkey, cheese, greens, hummus in a tortilla.',ingredients:[['turkey slices','Costco'],['tortillas','Costco'],['cheese','Costco'],['greens','Fred Meyer'],['hummus','Costco']]},

  {id:'sheet-chicken',name:'Sheet-pan chicken + vegetables',type:'dinner',protein:48,tags:['leftover','kid'],desc:'Chicken with potatoes, zucchini, carrots, asparagus or beans.',ingredients:[['chicken breasts/thighs','Costco'],['potatoes','Costco'],['zucchini','Fred Meyer'],['carrots','Costco'],['asparagus or green beans','Costco']]},
  {id:'sheet-sausage',name:'Sheet-pan sausage + vegetables',type:'dinner',protein:32,tags:['leftover','kid'],desc:'Chicken sausage with sweet potatoes, peppers and green beans.',ingredients:[['chicken sausage','Costco'],['sweet potatoes','Costco'],['bell peppers','Costco'],['green beans','Costco']]},
  {id:'turkey-tacos',name:'Ground turkey taco night',type:'dinner',protein:42,tags:['leftover','kid'],desc:'Ground turkey, black beans, tortillas, cheese and toppings.',ingredients:[['ground turkey','Costco'],['black beans','Costco'],['tortillas','Costco'],['shredded cheese','Costco'],['avocados','Costco'],['salsa','Trader Joe\'s']]},
  {id:'sweet-potato-tacos',name:'Sweet potato + black bean tacos',type:'dinner',protein:26,tags:['leftover','new'],desc:'Roasted sweet potatoes, seasoned black beans, slaw and avocado crema.',ingredients:[['sweet potatoes','Costco'],['black beans','Costco'],['tortillas','Costco'],['slaw mix','Trader Joe\'s'],['avocados','Costco']]},
  {id:'salmon',name:'Freezer salmon + potatoes',type:'dinner',protein:46,tags:['leftover','kid'],desc:'Your salmon with roasted potatoes and a green vegetable.',ingredients:[['potatoes','Costco'],['broccoli or asparagus','Costco'],['lemon','Fred Meyer']]},
  {id:'fish-tacos',name:'Salmon fish tacos',type:'dinner',protein:40,tags:['leftover','new'],desc:'Salmon, cabbage slaw, tortillas, avocado and lime yogurt sauce.',ingredients:[['tortillas','Costco'],['cabbage slaw','Trader Joe\'s'],['avocados','Costco'],['limes','Fred Meyer'],['Greek yogurt','Costco']]},
  {id:'burgers',name:'Burgers + oven potatoes',type:'dinner',protein:40,tags:['kid','leftover'],desc:'Lean beef or turkey burgers; oven potatoes and salad.',ingredients:[['lean ground beef or turkey','Costco'],['burger buns','Costco'],['potatoes','Costco'],['salad greens','Costco']]},
  {id:'beef-bowls',name:'Budget beef rice bowls',type:'dinner',protein:42,tags:['leftover','new'],desc:'Thin-sliced chuck or sirloin, rice, broccoli and a quick soy-ginger sauce.',ingredients:[['chuck steak or sirloin','Costco'],['rice','Costco'],['broccoli','Costco'],['soy sauce','Trader Joe\'s'],['ginger','Fred Meyer']]},
  {id:'greek-bowls',name:'Greek chicken bowls',type:'dinner',protein:45,tags:['leftover'],desc:'Chicken, rice or quinoa, cucumber, tomato, feta, hummus and tzatziki.',ingredients:[['chicken','Costco'],['rice or quinoa','Costco'],['cucumber','Costco'],['tomatoes','Costco'],['feta','Costco'],['hummus','Costco'],['tzatziki','Trader Joe\'s']]},
  {id:'rice-beans',name:'Rice, beans + taco toppings',type:'dinner',protein:28,tags:['leftover','kid'],desc:'Cheap, easy, customizable; add chicken or eggs for extra protein.',ingredients:[['rice','Costco'],['black or pinto beans','Costco'],['cheese','Costco'],['salsa','Trader Joe\'s'],['avocados','Costco']]},
  {id:'dumpling-soup',name:'Dumpling soup',type:'dinner',protein:30,tags:['quick','kid'],desc:'Frozen dumplings, broth, greens and edamame.',ingredients:[['frozen dumplings','Trader Joe\'s'],['broth','Costco'],['spinach','Costco'],['edamame','Costco']]},
  {id:'turkey-chili',name:'Big-batch turkey chili',type:'dinner',protein:43,tags:['leftover','kid'],desc:'Ground turkey, beans, tomatoes and corn. Freeze extra.',ingredients:[['ground turkey','Costco'],['kidney/black beans','Costco'],['canned tomatoes','Costco'],['corn','Costco']]},
  {id:'pizza',name:'Family pizza + big salad',type:'dinner',protein:30,tags:['kid'],desc:'Easy pizza night; add chicken sausage or turkey pepperoni to boost protein.',ingredients:[['pizza crusts','Trader Joe\'s'],['mozzarella','Costco'],['pizza sauce','Trader Joe\'s'],['salad kit','Costco']]},

  {id:'shake',name:'Protein shake',type:'snack',protein:28,tags:['quick'],desc:'Protein powder + milk + optional banana.',ingredients:[['protein powder','Costco'],['milk','Fred Meyer'],['bananas','Costco']]},
  {id:'cottage',name:'Cottage cheese + fruit',type:'snack',protein:25,tags:['quick'],desc:'One cup cottage cheese with berries or pineapple.',ingredients:[['cottage cheese','Costco'],['fruit','Costco']]},
  {id:'yogurt-snack',name:'Greek yogurt cup',type:'snack',protein:18,tags:['quick'],desc:'Fast protein without cooking.',ingredients:[['Greek yogurt','Costco']]},
  {id:'protein-balls',name:'Protein balls',type:'snack',protein:12,tags:['quick','kid'],desc:'Oats, nut butter and protein powder; batch once.',ingredients:[['oats','Costco'],['peanut butter','Costco'],['protein powder','Costco']]},
  {id:'none',name:'No extra boost',type:'snack',protein:0,tags:[],desc:'',ingredients:[]},
];

const mealById=Object.fromEntries(meals.map(m=>[m.id,m]));
const recipes={
  'overnight-oats':{serves:'1 jar',time:'5 min + chill',ingredients:['½ cup rolled oats','½ cup Fairlife milk','⅓ cup Greek yogurt','½ cup berries','Optional: ½ scoop protein powder'],steps:['Stir everything except the berries in a jar.','Cover and refrigerate overnight.','Add berries before eating.'],storage:'Keeps refrigerated for up to 4 days.'},
  'egg-box':{serves:'1 breakfast',time:'5 min',ingredients:['2 hard-boiled eggs','1 Greek yogurt cup','1 piece of fruit'],steps:['Pack the eggs, yogurt, and fruit together.'],storage:'Keep chilled; use cooked eggs within 1 week.'},
  'protein-muffins':{serves:'12 muffins',time:'30 min',ingredients:['2 cups protein pancake mix','2 eggs','1 cup milk','2 mashed bananas','1 cup berries or chocolate chips','Greek yogurt for serving'],steps:['Heat oven to 350°F and grease a 12-cup muffin pan.','Stir the mix, eggs, milk, and bananas until just combined. Fold in berries.','Divide into the pan and bake 16–20 minutes, until set.','Serve 2 muffins with Greek yogurt.'],storage:'Refrigerate 5 days or freeze up to 2 months.'},
  pancakes:{serves:'4 people',time:'25 min',ingredients:['Pancake mix for 8 pancakes','Milk and eggs called for on package','6 eggs for the side','Fruit for serving'],steps:['Mix and cook pancakes according to the package.','Scramble or fry the eggs while the pancakes cook.','Serve with fruit and milk.'],storage:'Freeze extra pancakes between sheets of parchment.'},
  'yogurt-bowl':{serves:'1 bowl',time:'5 min',ingredients:['1 cup Greek yogurt','½ cup berries','¼ cup granola','1 tsp chia seeds','Optional: 1 tbsp peanut butter'],steps:['Spoon yogurt into a bowl and add the toppings.'],storage:'Assemble just before eating so the granola stays crisp.'},
  leftovers:{serves:'1 lunch',time:'5 min',ingredients:['1 packed serving from the previous dinner'],steps:['Reheat the reserved dinner serving until steaming hot, or enjoy cold when appropriate.'],storage:'Pack the lunch portion when cleaning up dinner.'},
  'greek-cold-salad':{serves:'4 lunches',time:'25 min',ingredients:['1 cup dry quinoa','1 can chickpeas, drained','2 cups chopped kale','1 cup tomatoes','½ cup olives','½ cup feta','Optional: 2 cups cooked chicken','⅓ cup Greek dressing'],steps:['Cook quinoa, then spread it out to cool.','Massage kale with a spoonful of dressing.','Combine quinoa, chickpeas, vegetables, feta, and chicken.','Keep remaining dressing separate until serving.'],storage:'Refrigerate up to 4 days.'},
  'turkey-wrap':{serves:'1 lunch',time:'5 min',ingredients:['1 large tortilla','4–5 oz turkey','1 slice cheese','Handful of greens','2 tbsp hummus','Fruit'],steps:['Spread hummus over the tortilla.','Layer turkey, cheese, and greens; roll tightly.','Serve with fruit.'],storage:'Wrap tightly and refrigerate up to 24 hours.'},
  'sheet-chicken':{serves:'4: 2 dinner + 2 lunches',time:'45 min',ingredients:['2 lb chicken breasts or thighs','1½ lb potatoes, chopped','2 zucchini or 4 carrots, chopped','12 oz green beans or asparagus','2 tbsp olive oil','Garlic powder, paprika, salt, and pepper'],steps:['Heat oven to 425°F.','Toss potatoes with half the oil and seasoning; roast 15 minutes.','Add seasoned chicken and remaining vegetables to the pan.','Roast 20–25 minutes, until chicken reaches 165°F and vegetables are tender.','Before serving, pack 2 complete lunch portions.'],storage:'Refrigerate lunch portions up to 4 days; reheat until steaming.'},
  'sheet-sausage':{serves:'4: 2 dinner + 2 lunches',time:'40 min',ingredients:['24 oz chicken sausage, sliced','2 large sweet potatoes, cubed','2 bell peppers, chopped','12 oz green beans','2 tbsp olive oil','Italian seasoning, salt, and pepper'],steps:['Heat oven to 425°F.','Roast seasoned sweet potatoes with oil for 15 minutes.','Add sausage, peppers, and beans; roast 18–22 minutes more.','Pack 2 lunch portions before serving dinner.'],storage:'Refrigerate up to 4 days and reheat until hot.'},
  'turkey-tacos':{serves:'4: 2 dinner + 2 lunches',time:'30 min',ingredients:['1½ lb ground turkey','1 can black beans','2 tbsp taco seasoning','12 tortillas','1½ cups shredded cheese','Salsa and avocado'],steps:['Brown turkey in a skillet; drain if needed.','Add seasoning, beans, and ½ cup water; simmer 5 minutes.','Set aside enough filling, tortillas, and toppings for 2 lunches.','Serve the remaining filling with tortillas and toppings.'],storage:'Store filling separately from tortillas and toppings for up to 4 days.'},
  'sweet-potato-tacos':{serves:'4: 2 dinner + 2 lunches',time:'40 min',ingredients:['2 large sweet potatoes, cubed','2 cans black beans','12 tortillas','3 cups slaw mix','2 avocados','½ cup Greek yogurt','1 lime','Taco seasoning'],steps:['Roast seasoned sweet potatoes at 425°F for 25–30 minutes.','Warm beans with a splash of water and taco seasoning.','Mash avocado with yogurt, lime, and salt.','Pack 2 lunch portions, keeping tortillas separate, then assemble dinner tacos.'],storage:'Refrigerate components separately up to 4 days.'},
  salmon:{serves:'4: 2 dinner + 2 lunches',time:'35 min',ingredients:['4 salmon fillets, 5–6 oz each','1½ lb potatoes, chopped','1 lb broccoli or asparagus','1 lemon','2 tbsp olive oil','Salt, pepper, and garlic powder'],steps:['Heat oven to 425°F; roast seasoned potatoes for 15 minutes.','Add salmon and vegetables, drizzle with oil, and season.','Roast 12–15 minutes, until salmon flakes easily.','Pack 2 lunch portions before serving.'],storage:'Refrigerate up to 3 days. Reheat gently or enjoy cold.'},
  'fish-tacos':{serves:'4: 2 dinner + 2 lunches',time:'30 min',ingredients:['1½ lb salmon','12 tortillas','4 cups cabbage slaw','2 avocados','¾ cup Greek yogurt','2 limes','Salt, cumin, and chili powder'],steps:['Season salmon and bake at 425°F for 12–15 minutes.','Mix yogurt with lime juice and salt.','Flake salmon and assemble tacos with slaw, avocado, and sauce.','Reserve 2 portions with tortillas packed separately.'],storage:'Refrigerate salmon and toppings separately up to 3 days.'},
  burgers:{serves:'4: 2 dinner + 2 lunches',time:'40 min',ingredients:['1½ lb lean beef or turkey','4 burger buns','1½ lb potatoes, cut into wedges','Salad greens','Salt, pepper, and preferred burger toppings'],steps:['Heat oven to 425°F and roast seasoned potato wedges for 30–35 minutes.','Form 4 patties and cook in a skillet or grill until safely done.','Set aside 2 patties and potato portions for lunches.','Serve remaining burgers with salad.'],storage:'Refrigerate patties separately from buns up to 4 days.'},
  'beef-bowls':{serves:'4: 2 dinner + 2 lunches',time:'35 min',ingredients:['1½ lb thin-sliced beef','2 cups dry rice','1½ lb broccoli','⅓ cup soy sauce','1 tbsp grated ginger','1 tbsp honey','1 tbsp oil'],steps:['Cook rice according to package directions.','Steam or roast broccoli until tender-crisp.','Mix soy sauce, ginger, honey, and ¼ cup water.','Sear beef in oil, add sauce, and simmer 2 minutes.','Build and pack 2 lunch bowls before serving dinner.'],storage:'Refrigerate bowls up to 4 days; reheat until steaming.'},
  'greek-bowls':{serves:'4: 2 dinner + 2 lunches',time:'35 min',ingredients:['1½ lb chicken','2 cups dry rice or 1½ cups dry quinoa','1 cucumber','1 pint tomatoes','¾ cup feta','¾ cup hummus','¾ cup tzatziki','Greek seasoning'],steps:['Cook rice or quinoa.','Season and cook chicken to 165°F, then slice.','Chop cucumber and tomatoes.','Build 4 bowls; immediately cover and refrigerate 2 for lunch.'],storage:'Keep hummus and tzatziki separate; refrigerate up to 4 days.'},
  'rice-beans':{serves:'4: 2 dinner + 2 lunches',time:'30 min',ingredients:['2 cups dry rice','2 cans black or pinto beans','1½ cups cheese','Salsa and avocado','Optional: 1 lb chicken or 4 eggs'],steps:['Cook rice according to package directions.','Warm beans with cumin, garlic powder, and a splash of water.','Cook optional chicken or eggs for extra protein.','Pack 2 lunch bowls before setting out dinner toppings.'],storage:'Refrigerate rice and beans up to 4 days; add avocado after reheating.'},
  'dumpling-soup':{serves:'4',time:'20 min',ingredients:['24–32 frozen dumplings','8 cups broth','2 cups shelled edamame','5 oz spinach','Soy sauce and sesame oil to taste'],steps:['Bring broth to a simmer.','Add dumplings and cook according to package directions.','Stir in edamame and spinach for the final 3 minutes.','Season to taste and serve.'],storage:'Best fresh; refrigerate up to 3 days. Dumplings will soften.'},
  'turkey-chili':{serves:'8: dinner, lunches + freezer',time:'50 min',ingredients:['2 lb ground turkey','3 cans beans, drained','2 large cans diced tomatoes','1 can corn','2 tbsp chili powder','2 tsp cumin','1 onion, chopped'],steps:['Brown turkey and onion in a large pot.','Add spices and cook 1 minute.','Stir in beans, tomatoes, corn, and 1 cup water.','Simmer uncovered for 30 minutes.','Pack 2 lunches and freeze at least 2 portions before dinner.'],storage:'Refrigerate 4 days or freeze up to 3 months.'},
  pizza:{serves:'4',time:'30 min',ingredients:['2 pizza crusts','2 cups pizza sauce','3 cups mozzarella','Optional chicken sausage or turkey pepperoni','1 large salad kit'],steps:['Heat oven according to crust directions.','Top crusts with sauce, cheese, and optional protein.','Bake until crisp and bubbling.','Toss salad and serve.'],storage:'Refrigerate leftover pizza up to 4 days.'},
  shake:{serves:'1',time:'3 min',ingredients:['1 scoop protein powder','10–12 oz milk','Optional banana and ice'],steps:['Blend or shake until smooth.'],storage:'Best immediately.'},
  cottage:{serves:'1',time:'2 min',ingredients:['1 cup cottage cheese','½–1 cup berries or pineapple'],steps:['Add fruit to cottage cheese and serve.'],storage:'Keep chilled.'},
  'yogurt-snack':{serves:'1',time:'1 min',ingredients:['1 Greek yogurt cup'],steps:['Open and enjoy.'],storage:'Keep chilled.'},
  'protein-balls':{serves:'16 balls',time:'15 min + chill',ingredients:['1½ cups oats','¾ cup peanut butter','½ cup protein powder','⅓ cup honey','2–4 tbsp milk'],steps:['Mix everything, adding just enough milk for the mixture to hold together.','Roll into 16 balls.','Chill for 30 minutes.'],storage:'Refrigerate 1 week or freeze up to 2 months.'}
};
const defaults={
  Monday:{breakfast:'overnight-oats',lunch:'turkey-wrap',dinner:'sheet-chicken',snack:'shake'},
  Tuesday:{breakfast:'egg-box',lunch:'leftovers',dinner:'turkey-tacos',snack:'yogurt-snack'},
  Wednesday:{breakfast:'protein-muffins',lunch:'leftovers',dinner:'salmon',snack:'cottage'},
  Thursday:{breakfast:'yogurt-bowl',lunch:'leftovers',dinner:'greek-bowls',snack:'shake'},
  Friday:{breakfast:'overnight-oats',lunch:'leftovers',dinner:'burgers',snack:'yogurt-snack'},
  Saturday:{breakfast:'pancakes',lunch:'greek-cold-salad',dinner:'pizza',snack:'cottage'},
  Sunday:{breakfast:'pancakes',lunch:'leftovers',dinner:'turkey-chili',snack:'shake'}
};

let state=JSON.parse(localStorage.getItem('prepPlateState')||'null') || {week:defaults,target:180,checks:{},stores:['Costco','Trader Joe\'s','Fred Meyer']};

function save(){
  localStorage.setItem('prepPlateState',JSON.stringify(state));
  if(currentHousehold&&!applyingRemoteState){
    clearTimeout(plannerSaveTimer);
    plannerSaveTimer=setTimeout(pushPlannerState,450);
  }
}
function setSyncStatus(message,mode=''){
  document.getElementById('syncStatus').textContent=message;
  document.querySelector('.sync-card').classList.remove('syncing','connected','error');
  if(mode)document.querySelector('.sync-card').classList.add(mode);
}
function showSyncControls(){
  document.getElementById('signedOutControls').hidden=!!currentUser;
  document.getElementById('householdControls').hidden=!currentUser||!!currentHousehold;
  document.getElementById('connectedControls').hidden=!currentUser||!currentHousehold;
  document.getElementById('signedInEmail').textContent=currentUser?.email||'';
  document.getElementById('householdInviteCode').textContent=currentHousehold?.invite_code||'';
}
async function sendSignInLink(){
  const email=document.getElementById('emailInput').value.trim();
  if(!email){setSyncStatus('Enter your email address first.','error');return;}
  setSyncStatus('Sending your secure sign-in link…','syncing');
  const {error}=await supabaseClient.auth.signInWithOtp({email,options:{emailRedirectTo:window.location.href.split('#')[0]}});
  setSyncStatus(error?error.message:'Check your email, then open the sign-in link on this device.',error?'error':'syncing');
}
async function createHousehold(){
  const name=document.getElementById('householdName').value.trim()||'Our household';
  setSyncStatus('Creating your shared household…','syncing');
  const {error}=await supabaseClient.rpc('create_household',{household_name:name});
  if(error){setSyncStatus(error.message,'error');return;}
  await loadHousehold();
  await pushPlannerState();
}
async function joinHousehold(){
  const code=document.getElementById('inviteCode').value.trim();
  if(!code){setSyncStatus('Enter the household invite code.','error');return;}
  setSyncStatus('Joining the household…','syncing');
  const {error}=await supabaseClient.rpc('join_household',{code});
  if(error){setSyncStatus(error.message,'error');return;}
  await loadHousehold();
}
async function loadHousehold(){
  const {data:membership,error}=await supabaseClient.from('household_members').select('household_id').limit(1).maybeSingle();
  if(error){setSyncStatus(error.message,'error');return;}
  if(!membership){currentHousehold=null;showSyncControls();setSyncStatus('Create a household, or enter the invite code from your spouse.');return;}
  const {data:household,error:householdError}=await supabaseClient.from('households').select('id,name,invite_code').eq('id',membership.household_id).single();
  if(householdError){setSyncStatus(householdError.message,'error');return;}
  currentHousehold=household;showSyncControls();
  await loadSharedState();subscribeToHousehold();
  setSyncStatus(`Connected to ${household.name}. Changes sync automatically.`,'connected');
}
async function loadSharedState(){
  const [{data:planner},{data:checks}]=await Promise.all([
    supabaseClient.from('planner_state').select('data').eq('household_id',currentHousehold.id).maybeSingle(),
    supabaseClient.from('shopping_checks').select('item_key,checked').eq('household_id',currentHousehold.id)
  ]);
  applyingRemoteState=true;
  if(planner?.data)state={...state,...planner.data};
  state.checks=Object.fromEntries((checks||[]).map(x=>[x.item_key,x.checked]));
  localStorage.setItem('prepPlateState',JSON.stringify(state));
  applyingRemoteState=false;renderAll();
}
async function pushPlannerState(){
  if(!currentHousehold)return;
  const data={week:state.week,target:state.target,stores:state.stores};
  const {error}=await supabaseClient.from('planner_state').upsert({household_id:currentHousehold.id,data});
  if(error)setSyncStatus(`Could not sync the planner: ${error.message}`,'error');
}
async function pushShoppingCheck(itemKey,checked){
  if(!currentHousehold)return;
  const {error}=await supabaseClient.from('shopping_checks').upsert({household_id:currentHousehold.id,item_key:itemKey,checked});
  if(error)setSyncStatus(`Could not sync the shopping list: ${error.message}`,'error');
}
async function clearRemoteChecks(){
  if(!currentHousehold)return;
  const {error}=await supabaseClient.from('shopping_checks').delete().eq('household_id',currentHousehold.id);
  if(error)setSyncStatus(`Could not clear shared checks: ${error.message}`,'error');
}
function subscribeToHousehold(){
  if(realtimeChannel)supabaseClient.removeChannel(realtimeChannel);
  realtimeChannel=supabaseClient.channel(`household-${currentHousehold.id}`)
    .on('postgres_changes',{event:'UPDATE',schema:'public',table:'planner_state',filter:`household_id=eq.${currentHousehold.id}`},payload=>{
      if(payload.new.updated_by===currentUser.id)return;
      applyingRemoteState=true;state={...state,...payload.new.data};localStorage.setItem('prepPlateState',JSON.stringify(state));applyingRemoteState=false;renderAll();
    })
    .on('postgres_changes',{event:'*',schema:'public',table:'shopping_checks',filter:`household_id=eq.${currentHousehold.id}`},payload=>{
      const row=payload.new?.item_key?payload.new:payload.old;
      if(!row?.item_key)return;
      if(payload.eventType==='DELETE')delete state.checks[row.item_key];else state.checks[row.item_key]=payload.new.checked;
      localStorage.setItem('prepPlateState',JSON.stringify(state));renderShopping();
    }).subscribe();
}
async function initializeSupabase(){
  const {data:{session}}=await supabaseClient.auth.getSession();
  currentUser=session?.user||null;showSyncControls();
  if(currentUser)await loadHousehold();
  supabaseClient.auth.onAuthStateChange((_event,newSession)=>{
    const newUser=newSession?.user||null;
    if(newUser?.id===currentUser?.id)return;
    currentUser=newUser;currentHousehold=null;showSyncControls();
    if(currentUser)setTimeout(loadHousehold,0);else setSyncStatus('Sign in with your email to connect this device.');
  });
}
function optionsFor(type){
  return meals.filter(m=>m.type===type).map(m=>`<option value="${m.id}">${m.name} · ${m.protein}g</option>`).join('');
}
function getEffectiveLunch(dayIndex){
  const d=DAYS[dayIndex], id=state.week[d].lunch;
  if(id!=='leftovers') return mealById[id];
  if(dayIndex===0) return mealById['turkey-wrap'];
  return mealById[state.week[DAYS[dayIndex-1]].dinner];
}
function dayProtein(dayIndex){
  const d=DAYS[dayIndex], s=state.week[d];
  return mealById[s.breakfast].protein + getEffectiveLunch(dayIndex).protein + mealById[s.dinner].protein + mealById[s.snack].protein;
}
function renderWeek(){
  const grid=document.getElementById('weekGrid');grid.innerHTML='';
  DAYS.forEach((day,i)=>{
    const node=document.getElementById('dayTemplate').content.cloneNode(true);
    node.querySelector('.day-name').textContent=day;
    node.querySelector('.protein-badge').textContent=`~${dayProtein(i)}g`;
    ['breakfast','lunch','dinner','snack'].forEach(type=>{
      const sel=node.querySelector('.'+type);
      sel.innerHTML=optionsFor(type);
      sel.value=state.week[day][type];
      sel.addEventListener('change',e=>{state.week[day][type]=e.target.value;save();renderAll();});
      const recipeBtn=document.createElement('button');recipeBtn.className='recipe-link';recipeBtn.type='button';recipeBtn.textContent='View recipe';
      recipeBtn.addEventListener('click',()=>openRecipe(type==='lunch' ? getEffectiveLunch(i).id : state.week[day][type]));
      sel.closest('.slot').appendChild(recipeBtn);
    });
    const note=node.querySelector('.leftover-note');
    if(state.week[day].lunch==='leftovers'){
      note.textContent=i===0?'Monday leftovers default to an easy turkey wrap.':`Lunch uses extra ${getEffectiveLunch(i).name.toLowerCase()} from ${DAYS[i-1]}.`;
    }
    grid.appendChild(node);
  });
}
function renderLibrary(){
  const type=document.getElementById('mealTypeFilter').value, tag=document.getElementById('mealTagFilter').value;
  const wrap=document.getElementById('mealLibrary');wrap.innerHTML='';
  meals.filter(m=>m.id!=='none' && (type==='all'||m.type===type) && (tag==='all'||m.tags.includes(tag))).forEach(m=>{
    const el=document.createElement('article');el.className='meal-card';
    el.tabIndex=0;el.setAttribute('role','button');el.setAttribute('aria-label',`Open recipe for ${m.name}`);
    el.innerHTML=`<h3>${m.name}</h3><div class="meal-meta"><span class="pill">${m.type}</span>${m.tags.map(t=>`<span class="pill">${t}</span>`).join('')}</div><p>${m.desc}</p><footer><span>~${m.protein}g protein</span><span>Tap for recipe →</span></footer>`;
    el.addEventListener('click',()=>openRecipe(m.id));el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openRecipe(m.id);}});
    wrap.appendChild(el);
  });
}
function openRecipe(id){
  const meal=mealById[id],recipe=recipes[id];if(!meal||!recipe)return;
  document.getElementById('recipeType').textContent=meal.type.toUpperCase();
  document.getElementById('recipeTitle').textContent=meal.name;
  document.getElementById('recipeDescription').textContent=meal.desc;
  document.getElementById('recipeStats').innerHTML=`<span><strong>Portion plan:</strong> ${recipe.serves}</span><span><strong>${recipe.time}</strong> total time</span><span><strong>~${meal.protein}g</strong> protein per serving</span>`;
  const isLeftover=meal.type==='dinner'&&meal.tags.includes('leftover');
  const callout=document.getElementById('leftoverCallout');
  callout.classList.toggle('no-leftovers',!isLeftover);
  callout.innerHTML=isLeftover?'<strong>Cook dinner + tomorrow’s lunch</strong><span>Make all 4 servings—even if 2 feels like enough tonight. Pack the 2 lunch portions before serving dinner.</span>':'<strong>Make what you need today</strong><span>No next-day lunch is planned from this recipe unless you choose to make extra.</span>';
  document.getElementById('recipeIngredients').innerHTML=recipe.ingredients.map(x=>`<li>${x}</li>`).join('');
  document.getElementById('recipeSteps').innerHTML=recipe.steps.map(x=>`<li>${x}</li>`).join('');
  document.getElementById('storageNote').innerHTML=`<strong>Store & reheat</strong><span>${recipe.storage}</span>`;
  document.getElementById('recipeDialog').showModal();
}
function shoppingData(){
  const counts={};
  DAYS.forEach((day,i)=>{
    const s=state.week[day];
    const selected=[mealById[s.breakfast],getEffectiveLunch(i),mealById[s.dinner],mealById[s.snack]];
    selected.forEach(m=>m.ingredients.forEach(([item,store])=>{
      const key=store+'|'+item; counts[key]=(counts[key]||0)+1;
    }));
  });
  return Object.entries(counts).map(([key,count])=>{const [store,item]=key.split('|');return{store,item,count};});
}
function renderShopping(){
  const wrap=document.getElementById('shoppingList');wrap.innerHTML='';
  state.stores.forEach(store=>{
    const card=document.createElement('div');card.className='store-card';card.innerHTML=`<h3>${store}</h3>`;
    const items=shoppingData().filter(x=>x.store===store);
    if(!items.length) card.innerHTML+='<p>No items this week.</p>';
    items.forEach(x=>{
      const key=x.store+'|'+x.item; const row=document.createElement('label');row.className='shop-item'+(state.checks[key]?' checked':'');
      row.innerHTML=`<input type="checkbox" ${state.checks[key]?'checked':''}><span>${x.item}<small>Appears in ${x.count} planned meal${x.count>1?'s':''}</small></span>`;
      row.querySelector('input').addEventListener('change',e=>{state.checks[key]=e.target.checked;save();pushShoppingCheck(key,e.target.checked);renderShopping();}); card.appendChild(row);
    });wrap.appendChild(card);
  });
}
function prepTasks(){
  const tasks=[]; const planned=DAYS.flatMap((day,i)=>[mealById[state.week[day].breakfast],getEffectiveLunch(i),mealById[state.week[day].dinner],mealById[state.week[day].snack]]);
  const has=id=>planned.some(m=>m.id===id);
  if(planned.some(m=>['egg-box','pancakes'].includes(m.id))) tasks.push(['Boil a dozen eggs','Cool, peel or leave unpeeled, and keep a grab-and-go bowl in the fridge.']);
  if(planned.some(m=>m.id==='overnight-oats')) tasks.push(['Make 3–4 overnight oats','Jar them all at once; add berries the night before or morning of.']);
  if(planned.some(m=>m.id==='protein-muffins')) tasks.push(['Bake protein muffins','Freeze half so breakfast stays easy later in the week.']);
  if(has('sheet-chicken')||has('greek-bowls')) tasks.push(['Cook extra chicken','Plan enough for dinner plus at least two adult lunches.']);
  if(planned.some(m=>m.id==='greek-cold-salad')) tasks.push(['Make quinoa salad base','Keep dressing separate so it travels well for lunch.']);
  if(planned.some(m=>m.id==='protein-balls')) tasks.push(['Roll protein balls','Make one batch and refrigerate for snacks.']);
  tasks.push(['Wash and portion fruit','Make the easy choice genuinely easy for kids and adults.']);
  tasks.push(['Choose your “protein rescue”','Keep Greek yogurt, cottage cheese, shakes, or eggs ready for days that land short of your target.']);
  return tasks;
}
function renderPrep(){
  const wrap=document.getElementById('prepList');wrap.innerHTML='';prepTasks().forEach(([title,desc],idx)=>{const row=document.createElement('label');row.className='prep-item';row.innerHTML=`<input type="checkbox"><div><strong>${title}</strong><p>${desc}</p></div>`;wrap.appendChild(row);});
}
function renderAll(){document.getElementById('proteinTarget').value=state.target;document.getElementById('proteinTargetLabel').textContent=state.target;renderWeek();renderLibrary();renderShopping();renderPrep();}

function generateWeek(){
  const breakfastPool=['overnight-oats','egg-box','protein-muffins','yogurt-bowl'];
  const dinnerPool=['sheet-chicken','turkey-tacos','salmon','greek-bowls','burgers','beef-bowls','rice-beans','dumpling-soup','turkey-chili','sheet-sausage','fish-tacos'];
  DAYS.forEach((day,i)=>{
    state.week[day].breakfast=(i>=5?'pancakes':breakfastPool[(i+Math.floor(Math.random()*breakfastPool.length))%breakfastPool.length]);
    state.week[day].lunch=i===0?'turkey-wrap':'leftovers';
    state.week[day].dinner=dinnerPool.splice(Math.floor(Math.random()*dinnerPool.length),1)[0] || 'sheet-chicken';
    const subtotal=mealById[state.week[day].breakfast].protein+getEffectiveLunch(i).protein+mealById[state.week[day].dinner].protein;
    state.week[day].snack=subtotal<state.target-20?'shake':(i%2?'yogurt-snack':'cottage');
  }); save();renderAll();
}

document.querySelectorAll('.tab').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.tab').forEach(b=>b.classList.remove('active'));document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active-panel'));btn.classList.add('active');document.getElementById(btn.dataset.tab).classList.add('active-panel');}));
document.getElementById('proteinTarget').addEventListener('input',e=>{state.target=+e.target.value;document.getElementById('proteinTargetLabel').textContent=state.target;save();});
document.getElementById('generateWeek').addEventListener('click',generateWeek);
document.getElementById('resetWeek').addEventListener('click',()=>{state.week=JSON.parse(JSON.stringify(defaults));save();renderAll();});
document.getElementById('mealTypeFilter').addEventListener('change',renderLibrary);document.getElementById('mealTagFilter').addEventListener('change',renderLibrary);
document.getElementById('clearChecks').addEventListener('click',()=>{state.checks={};save();clearRemoteChecks();renderShopping();});document.getElementById('refreshPrep').addEventListener('click',renderPrep);
document.querySelectorAll('.storeToggle').forEach(cb=>{cb.checked=state.stores.includes(cb.value);cb.addEventListener('change',()=>{state.stores=[...document.querySelectorAll('.storeToggle:checked')].map(x=>x.value);save();renderShopping();});});
document.getElementById('closeRecipe').addEventListener('click',()=>document.getElementById('recipeDialog').close());
document.getElementById('recipeDialog').addEventListener('click',e=>{if(e.target.id==='recipeDialog')e.target.close();});
document.getElementById('emailSignIn').addEventListener('click',sendSignInLink);
document.getElementById('emailInput').addEventListener('keydown',e=>{if(e.key==='Enter')sendSignInLink();});
document.getElementById('createHousehold').addEventListener('click',createHousehold);
document.getElementById('joinHousehold').addEventListener('click',joinHousehold);
document.getElementById('signOut').addEventListener('click',async()=>{await supabaseClient.auth.signOut();currentUser=null;currentHousehold=null;if(realtimeChannel)supabaseClient.removeChannel(realtimeChannel);showSyncControls();setSyncStatus('Signed out. This device is no longer syncing.');});

renderAll();
initializeSupabase();
