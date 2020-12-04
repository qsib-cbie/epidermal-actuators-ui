<script>
	import { Router, Link, Route } from "svelte-routing";
	import Manual from "./routes/Manual.svelte";
	import Automatic from "./routes/Automatic.svelte";

	export let url = "";
	let link = 0;
	$: config_img = link === 0 ? "images/config_icon.png" : "images/config_icon_off.png";
	$: touch_img = link === 1 ? "images/touch_icon.png" : "images/touch_icon_off.png";
	$: config_style = link === 0 ? "color: black;" : "color: gray;";
	$: touch_style = link === 1 ? "color: black;" : "color: gray;";

  </script>

  <style>
	  .link-wrapper {
		width: 49%;
		box-sizing: border-box;
		border-radius: 2px;
		padding: .5em;
		padding-left: 0em;
		padding-right: 0em;
		font-size: xx-large;
		text-align: center;
		background-color: white;
	  }

	  img {
		  height: auto;
		  width: 15%;
		  vertical-align: middle;
	  }
	  .icon {
		  width: 40%;
		  height: auto;
		  margin: 0em;
		  padding-left: 25%;
		  padding-right: 20%;
		  text-align: center;
	  }
  </style>

  <Router url="{url}">
	
	<div style={"height:"+ window.innerHeight*.87+"px;"}>
	  <Route path="/*" component="{Manual}" />
	  <Route path="automatic/*" component="{Automatic}" />
	</div>
	<nav>
	  	<Link class="link-wrapper" to="/">
			<button class="link-wrapper" on:click={() => link = 0} style={config_style}>
				<div class="icon">
					<img id="config_icon" src={config_img} alt="Configuration"/>  Configuration
				</div>
			</button>
	 	</Link>
		<Link class="link-wrapper" to="automatic">
			<button class="link-wrapper" on:click={() => link = 1} style={touch_style}>
				<div class="icon">
					<img id="touch_icon" src={touch_img} alt="Virtual Touch" />  Virtual Touch
				</div>
			</button>
		</Link>
	</nav>
  </Router>