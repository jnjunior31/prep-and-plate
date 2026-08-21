const DAYS=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

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

function save(){localStorage.setItem('prepPlateState',JSON.stringify(state));}
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
    el.innerHTML=`<h3>${m.name}</h3><div class="meal-meta"><span class="pill">${m.type}</span>${m.tags.map(t=>`<span class="pill">${t}</span>`).join('')}</div><p>${m.desc}</p><footer><span>~${m.protein}g protein</span><span>${m.ingredients.length} shopping items</span></footer>`;
    wrap.appendChild(el);
  });
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
      row.querySelector('input').addEventListener('change',e=>{state.checks[key]=e.target.checked;save();renderShopping();}); card.appendChild(row);
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
document.getElementById('clearChecks').addEventListener('click',()=>{state.checks={};save();renderShopping();});document.getElementById('refreshPrep').addEventListener('click',renderPrep);
document.querySelectorAll('.storeToggle').forEach(cb=>{cb.checked=state.stores.includes(cb.value);cb.addEventListener('change',()=>{state.stores=[...document.querySelectorAll('.storeToggle:checked')].map(x=>x.value);save();renderShopping();});});

renderAll();
